"use client";

import EventCard from "@/components/EventCard";
import { Event } from "@/types/Event";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  if (loading)
    return (
      <div>
        <p>Loading</p>
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>Hello. This is the events page.</h3>
        {event && (
          <EventCard
            eventTitle={event.title}
            eventDescription={event.description}
            eventLocation={event.location}
            startTime={event.startTime}
            endTime={event.endTime}
            eventImage={event.imageUrl}
            eventPrice={parseFloat(event.price.toString())}
          />
        )}
      </div>
    </main>
  );
}
