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
import axios from "axios";

interface CreateEventDialogProps {
  userId: string;
  siteAdmin: boolean | undefined;
}

export function CreateEventDialog({
  userId,
  siteAdmin,
}: CreateEventDialogProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);

  useEffect(() => {
    const fetchCommunitiesData = async () => {
      setCommunitiesLoading(true);
      try {
        const response = await axios.get(`/api/communities/users/${userId}`);
        const communitiesData = response.data.communities;
        setCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      } finally {
        setCommunitiesLoading(false);
      }
    };
    fetchCommunitiesData();
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
            Select a community to create an event for. Only site or community
            admins can create events.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap items-center justify-center m-1">
          {siteAdmin && (
            <DialogClose asChild>
              <Link href="/create-event/all" className="m-1">
                <CommunityDialogCard
                  id="all"
                  name="platty-all"
                  description="All members in your Organisation"
                />
              </Link>
            </DialogClose>
          )}
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
