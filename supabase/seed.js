const events = require("../prisma/dev-data/events.json");
const eventsUsers = require("../prisma/dev-data/events_users.json");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const runSeed = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  //insert events
  for (const event of events) {
    const { data, error } = await supabase.from("events").insert([
      {
        title: event.title,
        description: event.description,
        location: event.location,
        start_time: event.start_time,
        end_time: event.end_time,
        created_at: event.created_at,
        updated_at: event.updated_at,
        image_url: event.image_url,
        price: event.price,
        tagline: event.tagline,
      },
    ]);

    if (error) {
      console.error("Error inserting event:", error);
    } else {
      console.log("Inserted event:", data);
    }
  }

  //insert events_users
  for (const eventUser of eventsUsers) {
    const { data, error } = await supabase.from("events_users").insert([
      {
        user_id: eventUser.userId,
        event_id: eventUser.eventId,
        assigned_at: eventUser.assigned_at,
        in_calendar: false,
      },
    ]);

    if (error) {
      console.error("Error inserting events_users:", error);
    } else {
      console.log("Inserted events_users:", data);
    }
  }
};

runSeed();
