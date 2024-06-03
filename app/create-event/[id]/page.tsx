"use client";

import { CreateEventForm } from "@/components/CreateEventForm";
import { Community } from "@/types/Community";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateEventPage() {
  const [community, setCommunity] = useState<Community>();
  const [loading, setLoading] = useState(false);
  const { id: communityId } = useParams();

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
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <h3>
          Create a new event for{" "}
          <span className="text-destructive">{community?.name}</span>
        </h3>
        <div className="mt-5">
          <CreateEventForm />
        </div>

        <div className="flex justify-center flex-row flex-wrap gap-5 my-5"></div>
      </div>
    </main>
  );
}
