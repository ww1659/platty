"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/UserContext";

export type CommunityInfo = {
  id: string;
  name: string;
  description: string;
  member: boolean;
  admin: boolean;
};

export default function CommunityCard({
  id,
  name,
  description,
  member,
  admin,
}: CommunityInfo) {
  const [requestingJoin, setRequestingJoin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunityAdminId = async () => {
      try {
        const response = await axios.get(`/api/communities/${id}/admin`);
        const admin = response.data;
        setAdminId(admin);
      } catch (error) {
        console.error("Error fetching admin id:", error);
      } finally {
      }
    };
    fetchCommunityAdminId();
  }, []);

  const handleJoinCommunityClick = async () => {
    console.log("Notification sent to the Admin - in BETA!");

    // setRequestingJoin(true);
    // try {
    //   const response = await axios.post(
    //     `/api/notifications/communities/${id}`,
    //     {
    //       type: "community_join_request",
    //       userId: user?.id,
    //       adminId: adminId,
    //       status: "pending",
    //     }
    //   );
    //   console.log("Join request sent:", response.data);
    //   // Optionally, update UI to reflect pending request status
    // } catch (error) {
    //   console.error("Error joining community:", error);
    // } finally {
    //   setRequestingJoin(false);
    // }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <code>Beta</code>
            <div>{name}</div>
          </div>

          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className="rounded-lg bg-black dark:bg-white disabled:pointer-events-none disabled:opacity-50"
                  disabled={member}
                  onClick={handleJoinCommunityClick}
                >
                  {member ? (
                    <Check className="text-white dark:text-black p-1 w-8 h-8" />
                  ) : (
                    <div className="flex flex-row gap-2">
                      <Plus className="text-white dark:text-black p-1 w-8 h-8" />
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {member ? <p>Already a member</p> : <p>Request to Join</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-row justify-start gap-2 items-center">
          {member && <Badge variant="secondary">Member</Badge>}
          {admin && <Badge variant="secondary"> Admin</Badge>}
          {!member && <Badge>Available to Join</Badge>}
        </div>
      </CardFooter>
      {/* <CardContent>Number of Members: 12</CardContent> */}
    </Card>
  );
}
