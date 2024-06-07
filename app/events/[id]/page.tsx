"use client";

import { AddEventDialog } from "@/components/AddEventDialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/UserContext";
import {
  calculateDuration,
  formatDate,
  formatDateLong,
  formatDateShort,
} from "@/lib/utils";
import { Event } from "@/types/Event";
import { UserEvent } from "@/types/UserEvent";
import axios from "axios";
import { CheckIcon, HeartIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<UserEvent | null>(null);
  const [loading, setLoading] = useState(false);

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

  function handleClick() {
    console.log("click!!");
    const userId = user?.id;
    const data = {
      userId,
    };

    try {
      axios
        .post(`/api/events/${eventId}`, data)
        .then((response) => {
          console.log("Event added successfully:", response.data);

          setEvent((currentEvent) => {
            if (currentEvent) {
              return {
                ...currentEvent,
                assignedAt: new Date(),
              };
            }
            return currentEvent;
          });
        })
        .catch((error) => {
          console.error("Error creating event:", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function handleFavouritesClick() {
    console.log("added to favourites");
  }

  if (loading)
    return (
      <div>
        <p>Loading</p>
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
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
