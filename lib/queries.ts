// import prisma from "./connection";
import { createClient } from "@/supabase/server";
import { Community } from "@/types/Community";
import { Event } from "@/types/Event";

export type Userdata = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type CommunityMembers = {
  userData: Userdata[];
  numberOfMembers: number;
};

// export async function getAllEvents() {
//   return await prisma.event.findMany({});
// }

// export async function getEventById(eventId: string) {
//   return await prisma.event.findUnique({
//     where: {
//       id: parseInt(eventId),
//     },
//   });
// }

// export async function getEventsByUserId(userId: string) {
//   return await prisma.eventUser.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       event: true,
//     },
//   });
// }

export async function supaGetAllEvents() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Convert the data to the Event type
    const events: Event[] = data.map((event: any) => ({
      id: Number(event.id),
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: new Date(event.start_time),
      endTime: new Date(event.end_time),
      createdAt: new Date(event.created_at),
      updatedAt: new Date(event.updated_at),
      imageUrl: event.image_url,
      price: parseFloat(event.price),
      tagline: event.tagline,
      communityId: event.community_id,
    }));

    return events;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching events: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred: ${error}`);
    }
  }
}

export async function supaGetEventById(eventId: string): Promise<Event | null> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // If no data is returned, return null
    if (!data) {
      return null;
    }

    // Convert the data to the Event type
    const event: Event = {
      id: Number(data.id),
      title: data.title,
      description: data.description,
      location: data.location,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      imageUrl: data.image_url,
      price: parseFloat(data.price),
      tagline: data.tagline,
      communityId: data.community_id,
    };

    return event;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching event: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred: ${error}`);
    }
  }
}

export async function supaGetEventsByUserId(userId: string): Promise<Event[]> {
  const supabase = createClient();
  try {
    const { data: eventUsersData, error: eventUsersError } = await supabase
      .from("events_users")
      .select("*")
      .eq("user_id", userId);

    if (eventUsersError) {
      throw new Error(`Supabase error: ${eventUsersError.message}`);
    }

    const eventIds = eventUsersData.map((eventUser: any) => eventUser.event_id);

    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds);

    if (eventsError) {
      throw new Error(`Supabase error: ${eventsError.message}`);
    }

    const events: Event[] = eventsData.map((event: any) => ({
      id: Number(event.id),
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: new Date(event.start_time),
      endTime: new Date(event.end_time),
      createdAt: new Date(event.created_at),
      updatedAt: new Date(event.updated_at),
      imageUrl: event.image_url,
      price: parseFloat(event.price),
      tagline: event.tagline,
      communityId: event.community_id,
    }));

    return events;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching events: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred: ${error}`);
    }
  }
}

export async function supaFindUserByEmail(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
}

export async function supaGetAllCommunities() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("communities").select("*");

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    const communities: Community[] = data.map((community: Community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
    }));

    return communities;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching events: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred: ${error}`);
    }
  }
}

export async function supaGetCommunityMembers(
  communityId: string
): Promise<CommunityMembers | null> {
  const supabase = createClient();
  try {
    const { data: communityUsers, error: communityUsersError } = await supabase
      .from("communities_users")
      .select("user_id")
      .eq("community_id", communityId);

    if (communityUsersError) {
      throw new Error(`Supabase error: ${communityUsersError.message}`);
    }

    if (!communityUsers) {
      return null;
    }

    const userIds = communityUsers.map(
      (communityUser) => communityUser.user_id
    );

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (userError) {
      throw new Error(`Supabase error: ${userError.message}`);
    }
    if (!userData) {
      return null;
    }

    return { userData: userData, numberOfMembers: userData.length };
  } catch (error) {
    throw new Error(`Unknown error occurred: ${error}`);
  }
}

export async function supaCheckIsAdmin(userId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("communities_users")
      .select("is_admin")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (data[0].is_admin) return true;
    else return false;
  } catch (error) {
    throw new Error(`Unknown error occurred: ${error}`);
  }
}
