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
import { UserEvent } from "@/types/UserEvent";
import axios from "axios";
import { CheckIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

interface AddEventDialogProps {
  event: UserEvent;
  setEvent: Function;
}

export function AddEventDialog({ event, setEvent }: AddEventDialogProps) {
  const { user } = useAuth();
  async function handleFreeClick() {
    const userId = user?.id;
    const data = {
      userId,
    };

    try {
      axios
        .post(`/api/events/${event.eventData.id}`, data)
        .then((response) => {
          console.log("Event added successfully:", response.data);

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
    }
  }

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
          {event.eventData.price === 0 ? (
            <Button onClick={handleFreeClick}>Add Free Event</Button>
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
                <Button className="w-full">
                  Add Event £{event.eventData.price}
                </Button>
              </Link>
            </div>
          )}
        </DialogHeader>
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
