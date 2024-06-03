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

import { getCommunitiesForAdmins } from "@/lib/serverActions";
import { useEffect, useState } from "react";
import { Community } from "@/types/Community";
import CommunityDialogCard from "./CommunityDialogCard";
import Link from "next/link";

interface CreateEventDialogProps {
  userId: string;
}

export function CreateEventDialog({ userId }: CreateEventDialogProps) {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const getCommunities = async () => {
      const response = await getCommunitiesForAdmins(userId);
      if (response && response.communities) {
        setCommunities(response?.communities);
      }
    };
    getCommunities();
  }, [userId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new Event</DialogTitle>
          <DialogDescription>
            Select a community to create an event for. Only community admins can
            create events.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap items-center justify-center m-1">
          {communities &&
            communities.map((community) => (
              <DialogClose asChild key={community.id}>
                <Link href={`/create-event/${community.id}`} className="m-1">
                  <CommunityDialogCard
                    id={community.id}
                    name={community.name}
                    description={community.description}
                  />
                </Link>
              </DialogClose>
            ))}
        </div>
        <DialogFooter className="sm:justify-start">
          {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
