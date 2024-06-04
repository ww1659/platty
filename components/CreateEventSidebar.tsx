"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

interface CreateEventSidebarProps extends React.HTMLAttributes<HTMLElement> {
  sidebarItems: {
    title: string;
    complete: boolean;
    value: any;
  }[];
  communityName: string;
}

export function CreateEventSidebar({
  className,
  sidebarItems,
  communityName,
  ...props
}: CreateEventSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="mt-1 fixed">
      <h4>{communityName}</h4>
      <nav
        className={cn(
          "flex space-x-2 flex-col space-x-0 space-y-7 mt-5",
          className
        )}
        {...props}
      >
        {sidebarItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-row justify-between items-center"
          >
            <div>
              <p className="text-sm font-bold">{item.title}</p>
            </div>
            <div>{item.complete ? <Check className="ml-5" /> : null}</div>
          </div>
        ))}
      </nav>
    </div>
  );
}
