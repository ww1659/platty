import { Metadata } from "next";

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
    title: "Start Time",
    complete: false,
  },

  {
    title: "End Time",
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
    <div>
      <main>{children}</main>
    </div>
  );
}
