import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { createClient } from "@/supabase/client";

import { formatDateShort, formatTime } from "@/lib/utils";
import { Event } from "@/types/Event";
import { Button } from "./ui/button";
import { postGoogleCalendarEvent } from "@/lib/api";
import { useAuth } from "@/context/UserContext";
import { getYear, getTime } from "date-fns";
import { CalendarPlus, Check } from "lucide-react";

type UserEvent = {
  eventData: Event;
  assignedAt: Date;
  inCalendar: boolean;
};

interface MyEventCardProps extends Event {
  assignedAt: Date;
  inCalendar: boolean;
  userEvents: UserEvent[] | null;
  setUserEvents: Function;
}

export default function MyEventCard({
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
}: MyEventCardProps) {
  const supabase = createClient();
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

        setUserEvents((currentEvents: UserEvent[]) =>
          (currentEvents || []).map((event) =>
            event.eventData.id === id ? { ...event, inCalendar: true } : event
          )
        );
      }
    }
  };

  return (
    <Card className="h-[80px] grid grid-cols-6 grid-rows-1 gap-5">
      <div className="col-span-1">
        <div className="h-full relative">
          {imageUrl && (
            <Image
              className="rounded-l-lg"
              src={imageUrl}
              alt={`Picture of ${title}`}
              priority={true}
              fill={true}
            />
          )}
        </div>
      </div>

      <div className="p-2 col-span-1 content-center">
        <p className="text-xs font-bold"> {getYear(startTime)}</p>
        <h4 className="font-md font-semibold">{formatDateShort(startTime)}</h4>
        <p className="text-xs">
          {formatTime(startTime)} - {formatTime(endTime)}
        </p>
      </div>

      <div className="p-2 col-span-2 content-center">
        <p className="text-xs font-bold">{location}</p>
        <h4 className="line-clamp-1 text-md">{title}</h4>
        {price.toString() === "0" ? (
          <p className="text-sm font-light">FREE</p>
        ) : (
          <p className="text-sm font-light">£{price.toString()}</p>
        )}
      </div>

      <div className="p-2 content-center">
        <h4>
          {memberCount}{" "}
          <span className="text-xs font-light">
            {memberCount === 1 ? "person" : "people"} going
          </span>
        </h4>
      </div>

      <div className="p-2 flex items-center justify-center">
        {inCalendar ? (
          <Button
            className="max-w-full"
            key={`button-${id}`}
            disabled={true}
            size="icon"
          >
            <Check />
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => createCalendarEvent()}
                  className="max-w-full"
                  key={`button-${id}`}
                  size="icon"
                >
                  <CalendarPlus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Google Calendar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </Card>
  );
}
