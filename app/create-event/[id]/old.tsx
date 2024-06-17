"use client";

import { CreateEventForm } from "@/components/CreateEventForm";
import { CreateEventSidebar } from "@/components/CreateEventSidebar";
import { useAuth } from "@/context/UserContext";
import { Community } from "@/types/Community";
import { SidebarItems } from "@/types/SidebarItems";
import { redirect, useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

export default function CreateEventPage() {
  const { id: communityId } = useParams();
  const [step, setStep] = useState(0);
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(false);
  const { communityAdmin, profile } = useAuth();
  const [sidebarItems, setSidebarItems] = useState<SidebarItems[]>([
    {
      title: "Name",
      complete: false,
      value: null,
    },
    { title: "Tagline", complete: false, value: null },
    {
      title: "Description",
      complete: false,
      value: null,
    },
    {
      title: "Price",
      complete: false,
      value: null,
    },
    {
      title: "Location",
      complete: false,
      value: null,
    },
    {
      title: "Event Timings",
      complete: false,
      value: null,
    },
    {
      title: "Image",
      complete: false,
      value: null,
    },
  ]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/create-event/${communityId}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setCommunity(data);
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
  }, [communityAdmin, profile?.isSiteAdmin]);

  if (loading)
    return (
      <main className="flex min-h-screen flex-col items-start justify-start">
        <div className="container mt-5">
          <h3>Loading....</h3>
          <div className="flex justify-center flex-row flex-wrap gap-5 my-5"></div>
        </div>
      </main>
    );

  return (
    <main className="flex min-h-screen flex-row items-start justify-start container">
      <aside className="w-1/4 p-4 bg-secondary border-x-2 h-dvh sticky left-0 top-0">
        {community && (
          <CreateEventSidebar
            sidebarItems={sidebarItems}
            communityName={community?.name}
          />
        )}
      </aside>
      <div className="container mt-5 w-3/4">
        <div className="flex flex-row items-center">
          <div className="mr-5">
            {step === 7 ? <h3>Review</h3> : <h3>Create a new Event</h3>}
          </div>
        </div>
        <div className="mt-5">
          <CreateEventForm
            step={step}
            setStep={setStep}
            setSidebarItems={setSidebarItems}
            communityId={communityId}
          />
        </div>
      </div>
    </main>
  );
}
