"use client";

import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import axios from "axios";
import { Event } from "@/types/Event";
import { useAuth } from "@/context/UserContext";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { capitaliseFirstLetter } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EventFilterDateDropdown } from "@/components/EventFilterDateDropdown";
import { EventPriceFilterDropdown } from "@/components/EventFilterPriceDropdown";
import { EventCommunityFilterDropdown } from "@/components/EventFilterCommunitiesDropdown";
import { Community } from "@/types/Community";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const supabase = createClient();
  const { user, profile } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const [communityFilter, setCommunityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

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
        const response = await axios.get(`/api/events`);
        const events = response.data;
        setEvents(events);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEventsData();
  }, [supabase.auth]);

  if (user && profile) {
    return (
      <main className="flex min-h-screen flex-col items-start justify-start container">
        <div className="flex flex-row w-full justify-between items-center mt-5 mt-5 pb-3 mb-5 border-b">
          <h3>Upcoming Events</h3>
          <div className="flex flex-row gap-5">
            <EventFilterDateDropdown />
            <EventPriceFilterDropdown />
            <EventCommunityFilterDropdown />
          </div>
        </div>
        {eventsLoading ? (
          <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center flex-row flex-wrap gap-5 mb-10">
            {events.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id}>
                <EventCard
                  eventTitle={event.title}
                  eventDescription={event.description}
                  eventLocation={event.location}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  eventImage={event.imageUrl}
                  eventPrice={parseFloat(event.price.toString())}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    );
  }
}
