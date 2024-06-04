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

import { Community } from "@/types/Community";
import { createClient } from "@/supabase/server";
import { supaCheckIsAdmin, supaGetCommunityMembers } from "@/lib/queries";

export default async function CommunityCard({
  id,
  name,
  description,
}: Community) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const userId = data.user?.id;
  const communityMembers = await supaGetCommunityMembers(id);
  const inCommunity = communityMembers?.userData.some(
    (user) => user.id === userId
  );
  let isAdmin = false;
  if (userId) {
    isAdmin = await supaCheckIsAdmin(userId);
  }

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex">{name}</div>
          <div className="flex">
            <div> {inCommunity && <Badge>Member</Badge>}</div>
            <div className="mx-1"> {isAdmin && <Badge>Admin</Badge>}</div>
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        Number of Members: {communityMembers?.numberOfMembers}
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-lg bg-black">
              {inCommunity ? (
                // <Button className="rounded-full" size="icon">
                <Check className="text-white p-1" />
              ) : (
                // </Button>
                // <Button className="rounded-full" variant="default" size="icon">
                <Plus />
                // </Button>
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {inCommunity ? <p>Already a member</p> : <p>Request to Join</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
