"use client";

import EventCard from "@/components/EventCard";
import { createClient } from "@/utils/supabase/client";
import { Event } from "@/types/Event";
import { useEffect, useState } from "react";

export default function EventPage() {
  const [userEvents, setUserEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchEventsData = async () => {
      setLoading(true);
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error || !userData?.user) {
          setLoading(false);
          console.log("No user:", error);
        }
        const userId = userData.user?.id;
        const response = await fetch(`/api/events/users/${userId}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const eventData = await response.json();
        setUserEvents(eventData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsData();
  }, []);

  if (loading)
    return (
      <div>
        <p>Loading</p>
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>Hello. This is YOUR events page.</h3>
        {userEvents &&
          userEvents.map((userEvent) => (
            <EventCard
              key={userEvent.id}
              eventTitle={userEvent.title}
              eventDescription={userEvent.description}
              eventLocation={userEvent.location}
              startTime={userEvent.startTime}
              endTime={userEvent.endTime}
              eventImage={userEvent.imageUrl}
              eventPrice={parseFloat(userEvent.price.toString())}
            />
          ))}
      </div>
    </main>
  );
}
