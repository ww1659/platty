import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchImage } from "@/lib/unsplash";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  startTime: Date;
  endTime: Date;
  eventImage: string;
  attendees: User[];
};

export default function EventCard({
  eventTitle,
  eventDescription,
  eventLocation,
  startTime,
  endTime,
  eventImage,
  attendees,
}: EventCardProps) {
  const numberOfAttendees = attendees.length;

  return (
    <Card className="w-[320px] flex flex-col">
      <div>
        {eventImage && (
          <Image
            className="flex-1 rounded-t-lg"
            src={eventImage}
            alt={eventTitle}
            width={320}
            height="0"
            priority={true}
          />
        )}
      </div>

      <CardHeader className="flex-1 flex flex-col pb-2">
        <CardTitle className="flex-1">{eventTitle}</CardTitle>
        <CardDescription className="flex-1">{eventDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="flex-1 text-sm font-bold">{formatDate(startTime)}</p>
        <p className="flex-1 text-sm font-light">{eventLocation}</p>
      </CardContent>
      <CardFooter className="flex-1 pb-2">
        <p className="font-bold">Attending: {numberOfAttendees}</p>
      </CardFooter>
    </Card>
  );
}
