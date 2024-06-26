"use client";

import MyEventCard from "@/components/MyEventCard";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/supabase/client";
import { Community } from "@/types/Community";
import { Event } from "@/types/Event";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { createColumns } from "./create-columns";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Icons } from "@/components/Icons";

type UserEvent = {
  eventData: Event;
  assignedAt: Date;
  inCalendar: boolean;
};

export default function EventPage() {
  const [filteredCommunities, setFilteredCommunities] = useState<string[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventsData = async () => {
      setEventsLoading(true);
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error || !userData?.user) {
          setEventsLoading(false);
          console.log("No user:", error);
          return;
        }
        const userId = userData.user?.id;
        const response = await axios.get(`/api/events/users/${userId}`);
        const eventData = response.data;
        setUserEvents(eventData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEventsData();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchCommunitiesData = async () => {
      setCommunitiesLoading(true);
      try {
        const userId = user?.id;
        const response = await axios.get(`/api/communities/users/${userId}`);
        const communitiesData = response.data.communities;
        setCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      } finally {
        setCommunitiesLoading(false);
      }
    };
    fetchCommunitiesData();
  }, [user]);

  const columns = createColumns(userEvents, setUserEvents);

  function handleToggle(communityId: string) {
    setFilteredCommunities((currentState) => {
      if (currentState.includes(communityId)) {
        return currentState.filter((id) => id !== communityId);
      } else {
        return [...currentState, communityId];
      }
    });
  }

  const filteredEvents: UserEvent[] = (userEvents || []).filter(
    (event) =>
      filteredCommunities.length === 0 ||
      filteredCommunities.includes(event.eventData.communityId ?? "platty-all")
  );

  if (eventsLoading || communitiesLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Icons.spinner className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <>
      <main className="flex min-h-screen flex-row items-start justify-start container">
        <div className="w-1/6 border-r h-screen pt-5 overflow-hidden">
          <h4 className="mb-1 rounded-md pr-2 py-1 text-sm font-semibold underline">
            Filter Events By Community
          </h4>
          <div className="grid grid-flow-row auto-rows-max text-sm">
            {communities.length > 0 ? (
              communities.map((community) => (
                <p
                  key={community.id}
                  className="group flex flex-row justify-between w-full items-center rounded-md border border-transparent pr-2 py-1 font-medium text-foreground"
                >
                  {community.name}
                  <Checkbox
                    className="mr-5"
                    onClick={() => handleToggle(community.id)}
                  />
                </p>
              ))
            ) : (
              <p className="group w-full items-center rounded-md border border-transparent pr-2 py-1 font-normal text-xs text-foreground">
                You are not a member of any communities...
              </p>
            )}
          </div>
        </div>
        <div className="w-5/6 pt-5 h-screen overflow-auto">
          <div className="container mx-auto">
            {userEvents && (
              <DataTable columns={columns} data={filteredEvents} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
