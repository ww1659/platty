"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuth } from "@/context/UserContext";
import { formatDate } from "@/lib/utils";
import { UserEvent } from "@/types/UserEvent";
import axios from "axios";
import { CheckIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "./Icons";
import { useToast } from "./ui/use-toast";

interface AddEventDialogProps {
  event: UserEvent;
  setEvent: Function;
}

export function AddEventDialog({ event, setEvent }: AddEventDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [addEventLoading, setAddEventLoading] = useState(false);

  async function handleFreeClick() {
    const userId = user?.id;
    const data = {
      userId,
    };
    setAddEventLoading(true);
    try {
      axios
        .post(`/api/events/${event.eventData.id}`, data)
        .then((response) => {
          toast({
            title: "Event Added!",
            variant: "default",
            description: `New event added to your events list. See the event in 'My Events'.`,
          });

          setEvent((currentEvent: any) => {
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
    } finally {
      setAddEventLoading(false);
    }
  }

  if (addEventLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Icons.spinner className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" disabled={event.assignedAt ? true : false}>
          {event.assignedAt ? <CheckIcon /> : <PlusIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign up to this Event</DialogTitle>
          <DialogDescription>
            Sign up to this event here. This will add the event to the &apos;My
            Events&apos; page.
          </DialogDescription>
          <div className="py-3">
            <h3 className="font-light">{event.eventData.title}</h3>
            <p className="font-light">
              When: {formatDate(event.eventData.startTime)}
            </p>
            <p>
              <span className="font-light">Cost: </span>
              <span className="font-medium">
                {event.eventData.price === 0
                  ? "Free"
                  : "£" + event.eventData.price}
              </span>
            </p>
          </div>
          {event.eventData.price === 0 ? (
            addEventLoading ? (
              <Button disabled={true}>
                <Icons.spinner className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <DialogClose>
                <Button onClick={handleFreeClick} className="w-full">
                  Add Free Event
                </Button>
              </DialogClose>
            )
          ) : (
            <div>
              <Link
                href={{
                  pathname: `/checkout/${event.eventData.id}`,
                  query: {
                    price: event.eventData.price,
                    name: event.eventData.title,
                  },
                }}
              >
                <Button className="w-full">To Stripe payment page</Button>
              </Link>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
