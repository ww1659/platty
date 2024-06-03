"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Community } from "@/types/Community";
import { Badge } from "./ui/badge";

export default function CommunityDialogCard({
  id,
  name,
  description,
}: Community) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex">{name}</div>
          <div className="flex">
            <div className="mx-1">
              {<Badge className="hover:bg-0">Admin</Badge>}
            </div>
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
