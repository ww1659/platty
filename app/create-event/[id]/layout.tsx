import { Metadata } from "next";

import { CreateEventSidebar } from "@/components/CreateEventSidebar";

export const metadata: Metadata = {
  title: "Sidebar",
  description: "Sidebar for managing the form state for creating a new event.",
};

const sidebarNavItems = [
  {
    title: "Name",
    complete: false,
  },
  {
    title: "Description",
    complete: false,
  },
  {
    title: "Image",
    complete: false,
  },
  {
    title: "Location",
    complete: false,
  },
  {
    title: "Time",
    complete: false,
  },
];

interface CreateEventLayoutProps {
  children: React.ReactNode;
}

export default function CreateEventLayout({
  children,
}: CreateEventLayoutProps) {
  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-secondary">
        <CreateEventSidebar items={sidebarNavItems} />
      </aside>
      <main className="w-3/4">{children}</main>
    </div>
  );
}
