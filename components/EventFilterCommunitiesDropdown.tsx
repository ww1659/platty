"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useAuth } from "@/context/UserContext";
import { Community } from "@/types/Community";

export function EventCommunityFilterDropdown() {
  const [userCommunities, setUserCommunities] = React.useState<Community[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchCommunitiesData = async () => {
      setCommunitiesLoading(true);
      try {
        const userId = user?.id;
        const response = await axios.get(`/api/communities/users/${userId}`);
        const communitiesData = response.data.communities;
        setUserCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      } finally {
        setCommunitiesLoading(false);
      }
    };
    fetchCommunitiesData();
  }, [user]);

  const communities = userCommunities.map((community) => {
    return { value: community.id, label: community.name };
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? communities.find((community) => community.value === value)?.label
            : "Filter by community"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {communities.map((community) => (
                <CommandItem
                  key={community.value}
                  value={community.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === community.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {community.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
