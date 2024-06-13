"use client";

import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import axios from "axios";
import { Event } from "@/types/Event";
import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const supabase = createClient();
  const { user, authError } = useAuth();
  const router = useRouter();

  if (authError || !user) {
    router.push("/error");
  }

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

  return (
    <main className="flex min-h-screen flex-col items-start justify-start container">
      <div className="mt-5">
        <h3>Welcome</h3>
        {eventsLoading ? (
          <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </main>
  );
}
