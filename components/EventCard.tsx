import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { formatDate } from "@/lib/utils";
import { ClockIcon, MapPinIcon } from "lucide-react";

type EventCardProps = {
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
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
    <Card className="w-[280px]">
      <div className="w-[280px] h-[186.9px] relative">
        {eventImage && (
          <Image
            className="flex-1 rounded-t-lg"
            src={eventImage}
            alt={eventTitle}
            fill={true}
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <CardHeader className="pb-3 min-h-50 max-h-80">
        <CardTitle className="line-clamp-1 pb-0.5">{eventTitle}</CardTitle>
        <CardDescription className="line-clamp-2">
          {eventDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="flex flex-row gap-2 items-center pb-1">
          <ClockIcon className="h-4 w-4" />
          {startTime && (
            <p className="text-sm font-bold">{formatDate(startTime)}</p>
          )}
        </div>

        <div className="flex flex-row gap-2 items-center pb-1">
          <MapPinIcon className="h-4 w-4" />
          <p className="text-sm font-light">{eventLocation}</p>
        </div>
      </CardContent>
      <CardFooter className="pb-1">
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
