"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/context/UserContext";
import { Event } from "@/types/Event";
import { postGoogleCalendarEvent } from "@/lib/api";
import { useToast } from "./ui/use-toast";
import { Icons } from "./Icons";

type UserEvent = {
  eventData: Event;
  assignedAt: Date;
  inCalendar: boolean;
};

interface ActionDropDownProps extends Event {
  assignedAt: Date;
  inCalendar: boolean;
  userEvents: UserEvent[] | null;
  setUserEvents: Function;
}
export default function ActionDropDown({
  id,
  title,
  tagline,
  description,
  location,
  startTime,
  endTime,
  imageUrl,
  price,
  memberCount,
  inCalendar,
  userEvents,
  setUserEvents,
}: ActionDropDownProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const createCalendarEvent = async () => {
    if (inCalendar) {
      console.log("Event is already in calendar!");
      return;
    }

    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const googleEvent = {
      summary: title,
      description: description,
      start: {
        dateTime: startTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime,
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
          eventId: id,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating inCalendar status:", error);
      } else {
        console.log("UserEvent inCalendar status updated successfully");
        toast({
          title: "Event added to Google Calendar",
          description: `This event has now been added to your google calendar`,
        });
        setUserEvents((currentEvents: UserEvent[]) =>
          (currentEvents || []).map((event) =>
            event.eventData.id === id ? { ...event, inCalendar: true } : event
          )
        );
      }
    }
  };

  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/events/${id}`)}>
          View Event Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createCalendarEvent} disabled={inCalendar}>
          <Icons.google className="h-4 w-4 mr-2" />
          Add to Calendar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
