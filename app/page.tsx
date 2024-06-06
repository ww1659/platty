import { supaGetAllEvents } from "@/lib/queries";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import { createClient } from "@/supabase/server";

export default async function Home() {
  const events = await supaGetAllEvents();
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    <h3>Supabase Error: {error.message}</h3>;
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
