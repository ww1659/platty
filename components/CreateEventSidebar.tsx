"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

interface CreateEventSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    complete: boolean;
  }[];
}

export function CreateEventSidebar({
  className,
  items,
  ...props
}: CreateEventSidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex space-x-2 flex-col space-x-0 space-y-3", className)}
      {...props}
    >
      {items.map((item) => (
        <div key={item.title} className="flex flex-row">
          <p>{item.title}</p>
          {item.complete ? (
            <Badge className="ml-2">
              <Check />
            </Badge>
          ) : null}
        </div>
      ))}
    </nav>
  );
}
