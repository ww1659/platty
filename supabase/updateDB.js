const moreEvents = [
  {
    title: "Autumn Festival",
    description:
      "Celebrate the arrival of autumn with food, music, and activities!",
    location: "Town Square",
    start_time: "2024-09-10 10:00:00+00",
    end_time: "2024-09-10 17:00:00+00",
    created_at: "2024-06-27 08:00:00+00",
    updated_at: "2024-06-27 08:00:00+00",
    image_url:
      "https://images.unsplash.com/photo-1505685296765-3a2736de412f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTQ3NzR8MHwxfHNlYXJjaHwxfHxBdXR1bW4lMjBGZXN0aXZhbHxlbnwwfHx8fDE3MTg0ODE5OTB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    price: "0",
    tagline: "Celebrate the arrival of autumn!",
    member_count: 1,
    community_id: "1bc8e973-c5c6-4464-b472-818321f2a8fd",
    admin: "988b26a1-c469-45d5-86a9-f714e1171f90",
  },
  {
    title: "Science Fair",
    description: "Explore exciting science projects and demonstrations.",
    location: "Community Hall",
    start_time: "2024-09-15 09:00:00+00",
    end_time: "2024-09-15 13:00:00+00",
    created_at: "2024-06-27 08:00:00+00",
    updated_at: "2024-06-27 08:00:00+00",
    image_url:
      "https://images.unsplash.com/photo-1527532982840-2d8b5b5401c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTQ3NzR8MHwxfHNlYXJjaHwxfHxTY2llbmNlJTIwRmFpcnxlbnwwfHx8fDE3MTg0ODE5OTB8MA&ixlib=rb-4.0.3&q=80&w=1080",
    price: "0",
    tagline: "Explore exciting science projects!",
    member_count: 1,
    community_id: null,
    admin: "988b26a1-c469-45d5-86a9-f714e1171f90",
  },
  {
    title: "Charity Run",
    description: "Join us for a 5K run to raise funds for local charities.",
    location: "City Park",
    start_time: "2024-09-22 08:00:00+00",
    end_time: "2024-09-22 11:00:00+00",
    created_at: "2024-06-27 08:00:00+00",
    updated_at: "2024-06-27 08:00:00+00",
    image_url:
      "https://images.unsplash.com/photo-1562073981-d6f8f96b132d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTQ3NzR8MHwxfHNlYXJjaHwxfHxDaGFyaXR5JTIwUnVufGVufDB8fHx8MTcxODQ4MTk5MHww&ixlib=rb-4.0.3&q=80&w=1080",
    price: "0",
    tagline: "Run for a cause!",
    member_count: 1,
    community_id: "1bc8e973-c5c6-4464-b472-818321f2a8fd",
    admin: "988b26a1-c469-45d5-86a9-f714e1171f90",
  },
  {
    title: "Cooking Class",
    description: "Learn to cook delicious meals with our professional chefs.",
    location: "Gourmet Kitchen",
    start_time: "2024-09-18 14:00:00+00",
    end_time: "2024-09-18 16:00:00+00",
    created_at: "2024-06-27 08:00:00+00",
    updated_at: "2024-06-27 08:00:00+00",
    image_url:
      "https://images.unsplash.com/photo-1556910096-6f5e8e93368d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTQ3NzR8MHwxfHNlYXJjaHwxfHxDb29raW5nJTIwQ2xhc3N8ZW58MHx8fHwxNzE4NDgxOTkwfDA&ixlib=rb-4.0.3&q=80&w=1080",
    price: "0",
    tagline: "Cook delicious meals!",
    member_count: 1,
    community_id: null,
    admin: "988b26a1-c469-45d5-86a9-f714e1171f90",
  },
  {
    title: "Stargazing Night",
    description:
      "Join us for a night under the stars with telescopes and expert guides.",
    location: "Hilltop Observatory",
    start_time: "2024-09-28 20:00:00+00",
    end_time: "2024-09-28 23:00:00+00",
    created_at: "2024-06-27 08:00:00+00",
    updated_at: "2024-06-27 08:00:00+00",
    image_url:
      "https://images.unsplash.com/photo-1494451930944-8998635c218e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTQ3NzR8MHwxfHNlYXJjaHwxfHxTdGFyZ2F6aW5nfGVufDB8fHx8MTcxODQ4MTk5MHww&ixlib=rb-4.0.3&q=80&w=1080",
    price: "0",
    tagline: "Experience the night sky!",
    member_count: 1,
    community_id: "1bc8e973-c5c6-4464-b472-818321f2a8fd",
    admin: "988b26a1-c469-45d5-86a9-f714e1171f90",
  },
];

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const runSeed = async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  //insert events
  for (const event of moreEvents) {
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
        community_id: event.community_id,
        member_count: event.member_count,
        admin: event.admin,
      },
    ]);

    if (error) {
      console.error("Error inserting event:", error);
    } else {
      console.log("Inserted event:", data);
    }
  }
};

runSeed();
