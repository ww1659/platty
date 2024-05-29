"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/supabase/client";
import { Event } from "@/types/Event";
import { useEffect, useState } from "react";

export default function EventPage() {
  const [userEvents, setUserEvents] = useState<Event[] | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { user } = useAuth();

  const session = supabase.auth.getSession();

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

  if (loading)
    return (
      <main className="flex min-h-screen flex-col items-start justify-start">
        <div className="container mt-5">
          <p>Loading</p>
        </div>
      </main>
    );

  const createCalendarEvent = async (userEvent: Event) => {
    console.log(createCalendarEvent);
    const event = {
      summary: userEvent.title,
      description: userEvent.description,
      start: {
        dateTime: userEvent.startTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: userEvent.endTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer " + (await session).data.session?.provider_token,
        },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        console.log("EVENT CREATED NICE ONE");
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>Hello. This is {user?.email} events page.</h3>
        <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
          {userEvents &&
            userEvents.map((userEvent) => (
              <>
                {" "}
                <EventCard
                  key={userEvent.id}
                  eventTitle={userEvent.title}
                  eventDescription={userEvent.description}
                  eventLocation={userEvent.location}
                  startTime={userEvent.startTime}
                  endTime={userEvent.endTime}
                  eventImage={userEvent.imageUrl}
                  eventPrice={parseFloat(userEvent.price.toString())}
                />{" "}
                <Button onClick={() => createCalendarEvent(userEvent)}>
                  Create Calendar Event
                </Button>
              </>
            ))}
        </div>
      </div>
    </main>
  );
}
