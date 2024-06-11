"use client";

import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import axios from "axios";
import { Event } from "@/types/Event";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const supabase = createClient();

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

  if (eventsLoading) {
    return (
      <main className="flex min-h-screen flex-col items-start justify-start container">
        <div className="mt-5">
          <h3>Loading events data</h3>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-start justify-start container">
      <div className="mt-5">
        <h3>Welcome</h3>
        <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
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
      </div>
    </main>
  );
}
