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
      <CardContent className="flex-1 flex flex-col pb-2">
        <p className="flex-1 text-sm font-bold">{formatDate(startTime)}</p>
        <p className="flex-1 text-sm font-light">{eventLocation}</p>
      </CardContent>
      <CardFooter className="flex-col justify-center items-start flex-1 pb-2">
        <div className="flex">
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
