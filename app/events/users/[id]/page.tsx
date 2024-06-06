"use client";

import MyEventCard from "@/components/MyEventCard";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/supabase/client";
import { Community } from "@/types/Community";
import { Event } from "@/types/Event";
import axios from "axios";
import { useEffect, useState } from "react";

type UserEvent = {
  eventData: Event;
  assignedAt: Date;
  inCalendar: boolean;
};

export default function EventPage() {
  const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const supabase = createClient();
  const { user, profile } = useAuth();

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

  // useEffect(() => {
  //   const fetch communitiesData = async () {
  //     setCommunitiesLoading(true);
  //     try {
  //          const userId = user?.id;
  //       const response = await axios.get(`/api/events/users/${userId}`);
  //       const eventData = response.data;
  //       setUserEvents(eventData);
  //     } catch (error) {
  //       console.error("Error fetching event data:", error);
  //     } finally {
  //       setEventsLoading(false);
  //     }
  // }, [])

  if (eventsLoading)
    return (
      <main className="flex min-h-screen flex-col items-start justify-start">
        <div className="container mt-5">
          <p>Loading</p>
        </div>
      </main>
    );

  return (
    <>
      <main className="flex min-h-screen flex-row items-start justify-start container">
        {/* <aside className="w-1/5 border-r h-screen pt-4 sticky left-0 top-0">
          BOOM
        </aside> */}
        <div className="w-1/6 border-r h-screen pt-5">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            Communities
          </h4>
          {/* <div className="grid grid-flow-row auto-rows-max text-sm">
            {communities.map((community) => (
              <p className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline font-medium text-foreground">
                {community.name}
              </p>
            ))}
          </div> */}
        </div>
        <div className="w-5/6 pt-5 container">
          <h3>Hello. This is {profile?.firstName}&apos;s events page.</h3>
          <div className="flex justify-center flex-col flex-wrap gap-5 mt-5">
            {userEvents &&
              userEvents.map((userEvent) => (
                <div key={userEvent.eventData.id}>
                  <MyEventCard
                    key={userEvent.eventData.id}
                    id={userEvent.eventData.id}
                    title={userEvent.eventData.title}
                    tagline={userEvent.eventData.tagline}
                    description={userEvent.eventData.description}
                    location={userEvent.eventData.location}
                    startTime={userEvent.eventData.startTime}
                    endTime={userEvent.eventData.endTime}
                    imageUrl={userEvent.eventData.imageUrl}
                    price={userEvent.eventData.price}
                    createdAt={userEvent.eventData.createdAt}
                    updatedAt={userEvent.eventData.updatedAt}
                    communityId={userEvent.eventData.communityId}
                    memberCount={userEvent.eventData.memberCount}
                    inCalendar={userEvent.inCalendar}
                    assignedAt={userEvent.assignedAt}
                    userEvents={userEvents}
                    setUserEvents={setUserEvents}
                  />
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
