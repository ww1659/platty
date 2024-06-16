"use client";

import CommunityCard from "@/components/CommunityCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";

export type CommunityInfo = {
  id: string;
  name: string;
  description: string;
  member: boolean;
  admin: boolean;
};

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<CommunityInfo[] | []>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);

  useEffect(() => {
    const fetchCommunitiesData = async () => {
      setCommunitiesLoading(true);
      try {
        const params = new URLSearchParams();
        user && params.append("userId", user.id);
        const response = await axios.get(
          `/api/communities?${params.toString()}`
        );
        const communitiesData = response.data;
        setCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      } finally {
        setCommunitiesLoading(false);
      }
    };
    fetchCommunitiesData();
  }, []);

  communitiesLoading && <p>loading</p>;

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <div className="border-b pb-3 mb-5 flex flex-row items-center gap-3">
          <h3>Communities</h3>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a Community"
          />
        </div>

        <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
          {communities &&
            communities.map((community) => (
              <div key={community.id}>
                <CommunityCard
                  id={community.id}
                  name={community.name}
                  description={community.description}
                  member={community.member}
                  admin={community.admin}
                />
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
