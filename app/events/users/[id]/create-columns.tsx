import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, InfoIcon, MapPinIcon } from "lucide-react";
import { formatDateTimeOnly } from "@/lib/utils";
import { UserEvent } from "@/types/UserEvent";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import ActionDropDown from "@/components/ActionsDropdown";
import { Icons } from "@/components/Icons";

function formatDate(dateInput: Date) {
  const formattedDate = format(new Date(dateInput), "dd MMM");
  return formattedDate;
}

function getDay(dateInput: Date) {
  const day = format(new Date(dateInput), "EEE");
  return day;
}

interface ColumnProps extends UserEvent {
  userEvents: UserEvent[] | null;
  setUserEvents: Function;
}

export const createColumns = (
  userEvents: UserEvent[] | null,
  setUserEvents: Function
): ColumnDef<UserEvent>[] => [
  {
    accessorKey: "eventData.imageUrl",
    header: "",
    cell: ({ row }) => {
      const imageUrl = row.original.eventData.imageUrl;
      const altText = row.original.eventData.title;
      return (
        <div>
          <Image
            className="rounded-lg p-0"
            src={imageUrl}
            alt={`Picture of ${altText}`}
            priority={true}
            width={150}
            height={120}
          />
        </div>
      );
    },
  },

  {
    accessorKey: "eventData.title",
    header: "",
    cell: ({ row }) => {
      const eventName = row.original.eventData.title;
      const eventTagline = row.original.eventData.tagline;
      const eventLocation = row.original.eventData.location;
      const inCalendar = row.original.inCalendar;

      return (
        <div className="font-medium flex flex-row items-center">
          <div>
            <div className="flex flex-row justify-start items-center">
              <h4 className="py-1 mr-2">{eventName}</h4>
              {inCalendar && (
                <div className="mt-1 bg-black text-white rounded-full h-5 w-5 flex flex-row items-center justify-center">
                  <Icons.google className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className="flex flex-row py-1 items-start">
              <InfoIcon size={18} className="mr-1" />
              <p className="text-xs">{eventTagline}</p>
            </div>
            <div className="flex flex-row py-1 items-start">
              <MapPinIcon size={18} className="mr-1" />
              <p className="text-xs">{eventLocation}</p>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "eventData.startTime",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-start">
          <Button
            variant="ghost"
            className=""
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const startTime = row.original.eventData.startTime;
      const endTime = row.original.eventData.endTime;
      return (
        <div className="font-medium">
          <div>
            <p className="text-xs">{getDay(startTime)}</p>
            <h4>{formatDate(startTime)}</h4>
            <p className="text-xs">
              {formatDateTimeOnly(startTime)} - {formatDateTimeOnly(endTime)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "eventData.price",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.eventData.price;
      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount);
      return (
        <div className="font-medium text-center">
          {formatted === "£0.00" ? <h4>Free</h4> : <h4>{formatted}</h4>}
        </div>
      );
    },
  },
  {
    accessorKey: "eventData.memberCount",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attending
            <ArrowUpDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const numberOfGuests = row.original.eventData.memberCount;
      return (
        <div className="font-medium text-center">
          <h4>{numberOfGuests}</h4>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <ActionDropDown
        id={row.original.eventData.id}
        title={row.original.eventData.title}
        tagline={row.original.eventData.tagline}
        description={row.original.eventData.description}
        location={row.original.eventData.location}
        startTime={row.original.eventData.startTime}
        endTime={row.original.eventData.endTime}
        imageUrl={row.original.eventData.imageUrl}
        price={row.original.eventData.price}
        createdAt={row.original.eventData.createdAt}
        updatedAt={row.original.eventData.updatedAt}
        communityId={row.original.eventData.communityId}
        memberCount={row.original.eventData.memberCount}
        inCalendar={row.original.inCalendar}
        assignedAt={row.original.assignedAt}
        userEvents={userEvents}
        setUserEvents={setUserEvents}
      />
    ),
  },
];
