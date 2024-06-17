"use client";

import { Icons } from "@/components/Icons";
import { NewEventForm } from "@/components/NewEventForm";
import { useAuth } from "@/context/UserContext";
import { Community } from "@/types/Community";
import { EventFormValues } from "@/types/EventFormValues";
import axios from "axios";
import { redirect, useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { ClockIcon, MapPinIcon } from "lucide-react";

export default function CreateEventPage() {
  const { id: communityId } = useParams();
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(false);
  const { communityAdmin, profile } = useAuth();

  const [eventName, setEventName] = useState<string | undefined>("");
  const [eventTagline, setEventTagline] = useState<string | undefined>("");
  const [eventDescription, setEventDescription] = useState<string | undefined>(
    ""
  );
  const [eventPrice, setEventPrice] = useState<number | undefined>(0.0);
  const [eventLocation, setEventLocation] = useState<string | undefined>("");
  const [eventStartDate, setEventStartDate] = useState<Date | undefined>(
    undefined
  );
  const [eventEndDate, setEventEndDate] = useState<Date | undefined>(undefined);
  const [eventImage, setEventImage] = useState<string | undefined>("");

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/create-event/${communityId}`);
        setCommunity(response.data);
      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunityData();
    }
  }, [communityId]);

  useLayoutEffect(() => {
    const isAuth = communityAdmin || profile?.isSiteAdmin;
    console.log(isAuth);

    if (!isAuth) {
      console.log("User is not authenticated to create an event");
      redirect("/");
    }
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Icons.spinner className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-start justify-start container">
      <div className="w-full mt-5 pb-3 mb-5 border-b flex flex-row gap-3 items-center">
        <code>{community?.name}</code>
        <h3>Create a new Event</h3>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full md:w-1/2 m-0 p-5 border rounded-lg bg-secondary">
          <NewEventForm
            setEventName={setEventName}
            setEventTagline={setEventTagline}
            setEventDescription={setEventDescription}
            setEventPrice={setEventPrice}
            setEventLocation={setEventLocation}
            setEventStartDate={setEventStartDate}
            setEventEndDate={setEventEndDate}
            setEventImage={setEventImage}
            communityId={communityId}
          />
        </div>
        <div className="w-1/2 py-0 px-5 m-0 invisible md:visible flex flex-col items-center">
          <h4 className="mb-5">
            This is what your events card will look like...
          </h4>
          <Card className="w-[280px]">
            <div className="w-[280px] h-[186.9px] relative rounded-t-lg">
              {eventImage === "" ? (
                <div className="w-full h-full bg-secondary" />
              ) : (
                <Image
                  className="flex-1 rounded-t-lg"
                  src={eventImage ? eventImage : ""}
                  alt={eventName ? eventName : ""}
                  fill={true}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
            <CardHeader className="pb-3 min-h-50 max-h-80">
              <CardTitle className="line-clamp-1 pb-0.5">
                {eventName === "" ? <>Placeholder Name</> : eventName}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {eventTagline === "" ? <>Placeholder tagline</> : eventTagline}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              <div className="flex flex-row gap-2 items-center pb-1">
                <ClockIcon className="h-4 w-4" />
                {eventStartDate ? (
                  <p className="text-sm font-bold">
                    {formatDate(eventStartDate)}
                  </p>
                ) : (
                  <p className="text-sm font-bold">01-01-2000</p>
                )}
              </div>

              <div className="flex flex-row gap-2 items-center pb-1">
                <MapPinIcon className="h-4 w-4" />
                {eventLocation === "" ? (
                  <p className="text-sm font-light">Location Placeholder</p>
                ) : (
                  <p className="text-sm font-light">{eventLocation}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="pb-1">
              {eventPrice === 0 ? <p>Free</p> : <p>£{eventPrice}</p>}
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
