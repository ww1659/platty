import Image from "next/image";
import { getAllEvents } from "@/lib/db";
import { Event, User } from "@prisma/client";
import EventCard from "@/components/EventCard";

type EventWithUsers = Event & {
  users: {
    user: User;
  }[];
};

export default async function Home() {
  const events: EventWithUsers[] = await getAllEvents();

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container">
        Home Page
        <div className="flex justify-center flex-row flex-wrap gap-5">
          {events.map((event) => (
            <EventCard
              key={event.id}
              eventTitle={event.title}
              eventDescription={event.description}
              eventLocation={event.location}
              startTime={event.startTime}
              endTime={event.endTime}
              attendees={event.users.map((userRelation) => userRelation.user)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
