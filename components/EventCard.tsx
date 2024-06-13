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
        {startTime && (
          <p className="text-sm font-bold">{formatDate(startTime)}</p>
        )}
        <p className="text-sm font-light">{eventLocation}</p>
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
