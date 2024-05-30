import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { useEffect, useState } from "react";
import { fetchImage } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type EventCardProps = {
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  startTime: Date;
  endTime: Date;
  eventImage: string;
  eventPrice: number;
};

export default function EventCard({
  eventTitle,
  eventDescription,
  eventLocation,
  startTime,
  endTime,
  eventImage,
  eventPrice,
}: EventCardProps) {
  return (
    <Card className="w-[320px]">
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

      <CardHeader>
        <CardTitle>{eventTitle}</CardTitle>
        <CardDescription>{eventDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-bold">{formatDate(startTime)}</p>
        <p className="text-sm font-light">{eventLocation}</p>
      </CardContent>
      <CardFooter>
        <div>
          {eventPrice.toString() === "0" ? (
            <p>Free</p>
          ) : (
            <p>£{eventPrice.toString()}</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
