"use client";

import { AddEventDialog } from "@/components/AddEventDialog";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/UserContext";
import {
  calculateDuration,
  formatDateLong,
  formatDateShort,
} from "@/lib/utils";
import { UserEvent } from "@/types/UserEvent";
import axios from "axios";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id: eventId } = useParams();
  const { user, authError } = useAuth();
  const [event, setEvent] = useState<UserEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (authError || !user) {
    router.push("/error");
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/events/${eventId}`, {
          params: { userId: user?.id },
        });
        setEvent(response.data.eventData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, user]);

  function handleFavouritesClick() {
    console.log("added to favourites");
  }

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-start justify-start">
        <div className="container mt-5 max-w-4xl">
          <div className="w-full">
            <Skeleton className="h-[200px] rounded-xl" />
          </div>
          <div className="mt-5">
            <div className="flex flex-row justify-between items-center">
              <div>
                <Skeleton className="h-4 w-[250px]" />
              </div>
              <div>
                <div className="flex flex-row">
                  <Skeleton className="h-10 w-10 m-1" />
                  <Skeleton className="h-10 w-10 m-1" />
                </div>
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-[400px] my-1" />
              <Skeleton className="h-4 w-[250px] my-3" />
            </div>
            <div className="flex flex-col justify-center items-center mt-10">
              <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="flex items-center space-x-2"></div>
      {event && (
        <div className="container mt-5 max-w-4xl">
          <div className="flex flex-col">
            <div className="relative h-64">
              <Image
                className="rounded-lg"
                src={event.eventData.imageUrl}
                alt={`Picture of ${event.eventData.title}`}
                layout="fill"
                objectFit="cover"
                priority={true}
                quality={100}
              />
            </div>
            <div className="mt-5">
              <div className="flex flex-row justify-between items-center">
                <div className="mb-2">
                  <h4 className="font-light">
                    {formatDateShort(event.eventData.startTime)}
                  </h4>
                </div>
                <div className="flex flex-row">
                  <div className="m-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleFavouritesClick} size="icon">
                            <HeartIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Add to saved event</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="m-1">
                    <AddEventDialog event={event} setEvent={setEvent} />
                  </div>
                </div>
              </div>
              <h1>{event.eventData.title} </h1>
              <div className="mt-2">
                <p>{event.eventData.tagline}</p>
              </div>
              <div className="mt-10">
                <div>
                  <h2>Event Details</h2>
                </div>

                <div className="mt-2">
                  <h4 className="my-1">
                    Price:{" "}
                    <span className="font-light">£{event.eventData.price}</span>
                  </h4>
                  <h4 className="my-1">
                    Location:{" "}
                    <span className="font-light">
                      {event.eventData.location}
                    </span>
                  </h4>
                  <h4 className="my-1">
                    Date:{" "}
                    <span className="font-light">
                      {formatDateLong(event.eventData.startTime)}
                    </span>
                  </h4>
                  <h4 className="my-1">
                    Duration:{" "}
                    <span className="font-light">
                      {
                        calculateDuration(
                          event.eventData.startTime,
                          event.eventData.endTime
                        ).hours
                      }{" "}
                      hours
                    </span>
                  </h4>
                  <h4 className="my-1">
                    About:{" "}
                    <span className="font-light">
                      {event.eventData.description}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
