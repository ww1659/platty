"use client";

import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import axios from "axios";
import { Event } from "@/types/Event";
import { useAuth } from "@/context/UserContext";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { EventFilterDateDropdown } from "@/components/EventFilterDateDropdown";
import { EventPriceFilterDropdown } from "@/components/EventFilterPriceDropdown";
import { EventCommunityFilterDropdown } from "@/components/EventFilterCommunitiesDropdown";
import { Community } from "@/types/Community";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const [communityFilter, setCommunityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEventsData = async () => {
      setEventsLoading(true);
      try {
        if (!user) {
          setEventsLoading(false);
          console.log("No user:");
          return;
        }
        const params = new URLSearchParams();
        if (communityFilter) params.append("community", communityFilter);
        if (priceFilter) params.append("price", priceFilter);
        if (searchQuery) params.append("search", searchQuery);
        const response = await axios.get(`/api/events?${params.toString()}`);
        const events = response.data;
        setEvents(events);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEventsData();
  }, [dateFilter, communityFilter, priceFilter, searchQuery]);

  return (
    <main className="flex min-h-screen flex-col items-start justify-start container">
      <div className="flex flex-row w-full justify-between items-center mt-5 mt-5 pb-3 mb-5 border-b">
        <h3>Upcoming Events</h3>
        <div className="flex flex-row gap-5">
          {/* <EventFilterDateDropdown
            value={dateFilter}
            setValue={setDateFilter}
          /> */}
          <EventPriceFilterDropdown
            value={priceFilter}
            setValue={setPriceFilter}
          />
          <EventCommunityFilterDropdown
            value={communityFilter}
            setValue={setCommunityFilter}
          />
          <Input
            className="w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
