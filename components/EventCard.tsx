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

type EventCardProps = {
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  startTime: Date;
  endTime: Date;
  attendees: User[];
};

export default function EventCard({
  eventTitle,
  eventDescription,
  eventLocation,
  startTime,
  endTime,
  attendees,
}: EventCardProps) {
  return (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle>{eventTitle}</CardTitle>
        <CardDescription>{eventDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{eventLocation}</p>
        <p>Start Time: {new Date(startTime).toLocaleString()}</p>
        <p>End Time: {new Date(endTime).toLocaleString()}</p>
      </CardContent>
      <CardFooter>
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.id}>
              {attendee.name} ({attendee.email})
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}
