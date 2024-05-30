"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { postGoogleCalendarEvent } from "@/lib/api";
import { createClient } from "@/supabase/client";
import { Event } from "@/types/Event";
import { useEffect, useState } from "react";

type UserEvent = {
  eventData: Event;
  assignedAt: Date;
  inCalendar: boolean;
};

export default function EventPage() {
  const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

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
  }, [supabase.auth]);

  const createCalendarEvent = async (userEvent: UserEvent) => {
    if (userEvent.inCalendar) {
      console.log("Event is already in calendar!");
      return;
    }

    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const googleEvent = {
      summary: userEvent.eventData.title,
      description: userEvent.eventData.description,
      start: {
        dateTime: userEvent.eventData.startTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: userEvent.eventData.endTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    const googleToken = session.data.session?.provider_token;
    const googleResponse = await postGoogleCalendarEvent(
      googleEvent,
      googleToken
    );

    if (googleResponse.status === "confirmed" && user) {
      const response = await fetch(`/api/events/users/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: userEvent.eventData.id,
          userId: user.id,
        }),
      });
      console.log(response, "IN PAGE");

      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating inCalendar status:", error);
      } else {
        console.log("UserEvent inCalendar status updated successfully");

        setUserEvents((currentEvents) =>
          (currentEvents || []).map((event) =>
            event.eventData.id === userEvent.eventData.id
              ? { ...event, inCalendar: true }
              : event
          )
        );
      }
    }
  };

  if (loading)
    return (
      <main className="flex min-h-screen flex-col items-start justify-start">
        <div className="container mt-5">
          <p>Loading</p>
        </div>
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>Hello. This is {user?.email} events page.</h3>
        <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
          {userEvents &&
            userEvents.map((userEvent) => (
              <div key={userEvent.eventData.id}>
                <EventCard
                  key={userEvent.eventData.id}
                  eventTitle={userEvent.eventData.title}
                  eventDescription={userEvent.eventData.description}
                  eventLocation={userEvent.eventData.location}
                  startTime={userEvent.eventData.startTime}
                  endTime={userEvent.eventData.endTime}
                  eventImage={userEvent.eventData.imageUrl}
                  eventPrice={parseFloat(userEvent.eventData.price.toString())}
                />
                {userEvent.inCalendar ? (
                  <p>In calendar!</p>
                ) : (
                  <Button
                    onClick={() => createCalendarEvent(userEvent)}
                    key={`button-${userEvent.eventData.id}`}
                  >
                    Create Calendar Event
                  </Button>
                )}
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
