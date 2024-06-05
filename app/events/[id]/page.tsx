"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { Event } from "@/types/Event";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        setEvent(response.data);
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

  function handleClick() {
    console.log("click!!");
    const userId = user?.id;
    const data = {
      userId,
    };

    try {
      axios
        .post(`/api/events/${eventId}`, data)
        .then((response) => {
          console.log("Event added successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error creating event:", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

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
        <Button onClick={handleClick}>Add to my events</Button>
      </div>
    </main>
  );
}
