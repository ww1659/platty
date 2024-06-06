"use client";

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
import axios from "axios";
import { HeartIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

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
                src={event.imageUrl}
                alt={`Picture of ${event.title}`}
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
                    {formatDateShort(event.startTime)}
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
                          <p>Add to saved events</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="m-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleClick} size="icon">
                            <PlusIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Sign up to this event</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <h1>{event.title} </h1>
              <div className="mt-2">
                <p>{event.tagline}</p>
              </div>
              <div className="mt-10">
                <div>
                  <h2>Event Details</h2>
                </div>

                <div className="mt-2">
                  <h4 className="my-1">
                    Price: <span className="font-light">£{event.price}</span>
                  </h4>
                  <h4 className="my-1">
                    Location:{" "}
                    <span className="font-light">{event.location}</span>
                  </h4>
                  <h4 className="my-1">
                    Date:{" "}
                    <span className="font-light">
                      {formatDateLong(event.startTime)}
                    </span>
                  </h4>
                  <h4 className="my-1">
                    Duration:{" "}
                    <span className="font-light">
                      {calculateDuration(event.startTime, event.endTime).hours}{" "}
                      hours
                    </span>
                  </h4>
                  <h4 className="my-1">
                    About:{" "}
                    <span className="font-light">{event.description}</span>
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
