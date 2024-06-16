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
  // const communityMembers = await supaGetCommunityMembers(id);
  // const inCommunity = communityMembers?.userData.some(
  //   (user) => user.id === userId
  // );
  // let isAdmin = false;
  // if (userId) {
  //   isAdmin = await supaCheckIsAdmin(userId);
  // }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div>{name}</div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className="rounded-lg bg-black dark:bg-white disabled:pointer-events-none disabled:opacity-50"
                  disabled={member}
                  onClick={() => {
                    console.log("Send notification to Admin");
                  }}
                >
                  {member ? (
                    <Check className="text-white dark:text-black p-1 w-8 h-8" />
                  ) : (
                    <Plus className="text-white dark:text-black p-1 w-8 h-8" />
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
        </div>
      </CardFooter>
      {/* <CardContent>Number of Members: 12</CardContent> */}
    </Card>
  );
}
