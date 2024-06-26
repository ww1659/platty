"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, SquareArrowRightIcon } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/context/UserContext";
import { Event } from "@/types/Event";
import { postGoogleCalendarEvent } from "@/lib/api";
import { useToast } from "./ui/use-toast";
import { Icons } from "./Icons";
import { useState } from "react";
import axios from "axios";
import { refreshAccessToken, validateAccessToken } from "@/lib/utils";

type UserEvent = {
  eventData: Event;
  assignedAt: Date;
  inCalendar: boolean;
};

interface ActionDropDownProps extends Event {
  assignedAt: Date;
  inCalendar: boolean;
  userEvents: UserEvent[] | null;
  setUserEvents: Function;
}
export default function ActionDropDown({
  id,
  title,
  tagline,
  description,
  location,
  startTime,
  endTime,
  imageUrl,
  price,
  memberCount,
  inCalendar,
  userEvents,
  setUserEvents,
}: ActionDropDownProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const { user, profile, session, providers } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const createCalendarEvent = async () => {
  //   setLoading(true);
  //   if (inCalendar) {
  //     console.log("Event is already in calendar!");
  //     return;
  //   }

  //   const session = await supabase.auth.getSession();
  //   if (!session) {
  //     throw new Error("User is not authenticated");
  //   }
  //   // check for provider token from Google
  //   const providerToken = session.data.session?.provider_token;
  //   const refreshToken = window.localStorage.getItem("oauth_provider_refresh_token");

  //   //no provider token from Google (not signed in via OAuth2)
  //   if (!providerToken) {
  //     console.log("NO PROVIDER TOKEN");

  //     const { data: googleData, error: googleError } =
  //       await supabase.auth.signInWithOAuth({
  //         provider: "google",
  //         options: {
  //           scopes: "https://www.googleapis.com/auth/calendar",
  //         },
  //       });
  //     if (googleError) {
  //       console.error("Google sign in error:", googleError);
  //       setLoading(false);
  //       return;
  //     }
  //     setLoading(false);
  //     router.refresh();
  //   }
  //   //provider token present
  //   else {
  //     try {
  //       //check provider token is valid
  //       const response = await axios.get(
  //         `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${providerToken}`
  //       );
  //       console.log(response, "VALID TOKEN RESPONSE");

  //       //provider token is invalid
  //       console.log(window.localStorage.getItem("oauth_provider_refresh_token")); // i want to use this rather than sign in again

  //       if (response.status !== 200 || response.data.error) {
  //         const { data, error } = await supabase.auth.signInWithOAuth({
  //           provider: "google",
  //           options: {
  //             scopes: "https://www.googleapis.com/auth/calendar",
  //           },
  //         });
  //         if (error) {
  //           console.error("Error during Google OAuth2 login:", error.message);
  //           return;
  //         }
  //         router.refresh();
  //         return;
  //       }

  //       //provider token is valid
  //       const googleEvent = {
  //         summary: title,
  //         description: description,
  //         start: {
  //           dateTime: startTime,
  //           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         },
  //         end: {
  //           dateTime: endTime,
  //           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         },
  //       };
  //       const googleToken = providerToken;
  //       const googleResponse = await postGoogleCalendarEvent(
  //         googleEvent,
  //         googleToken
  //       );

  //       //update state
  //       if (googleResponse.status === "confirmed" && user) {
  //         try {
  //           const response = await axios.post(`/api/events/users/${user.id}`, {
  //             eventId: id,
  //             userId: user.id,
  //           });

  //           if (response.status === 200 || response.status === 201) {
  //             console.log("UserEvent inCalendar status updated successfully");
  //             toast({
  //               title: "Event added to Google Calendar",
  //               description: `This event has now been added to your Google Calendar`,
  //             });
  //             setUserEvents((currentEvents: UserEvent[]) =>
  //               (currentEvents || []).map((event) =>
  //                 event.eventData.id === id
  //                   ? { ...event, inCalendar: true }
  //                   : event
  //               )
  //             );
  //           } else {
  //             console.error("Error updating inCalendar status:", response.data);
  //           }
  //         } catch (error) {
  //           if (axios.isAxiosError(error)) {
  //             console.error(
  //               "Error updating inCalendar status:",
  //               error.response?.data || error.message
  //             );
  //           } else {
  //             console.error("Unexpected error:", error);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error validating token:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const createCalendarEvent = async () => {
    setLoading(true);
    if (inCalendar) {
      console.log("Event is already in calendar!");
      setLoading(false);
      return;
    }

    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    let providerToken = session.data.session?.provider_token;
    // let providerToken = window.localStorage.getItem("oauth_provider_token");
    const refreshToken = window.localStorage.getItem(
      "oauth_provider_refresh_token"
    );

    console.log(providerToken, "FROM SUPABASE");
    console.log(window.localStorage.getItem("oauth_provider_token"));

    const isValidAccessToken = await validateAccessToken(providerToken);

    // Ensure user is signed in with Google and has a valid token
    if (!providerToken || !isValidAccessToken) {
      if (refreshToken) {
        try {
          providerToken = await refreshAccessToken(refreshToken);
        } catch (error) {
          console.error("Failed to refresh token:", error);
          setLoading(false);
          return;
        }
      } else {
        const { data: googleData, error: googleError } =
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              scopes: "https://www.googleapis.com/auth/calendar",
              redirectTo: window.location.href,
            },
          });

        if (googleError) {
          console.error("Google sign-in error:", googleError);
          setLoading(false);
          return;
        }

        // Refresh the session and get the new provider token
        const newSession = await supabase.auth.getSession();
        providerToken = newSession.data.session?.provider_token;
      }
    }

    try {
      const googleEvent = {
        summary: title,
        description: description,
        start: {
          dateTime: startTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const googleResponse = await postGoogleCalendarEvent(
        googleEvent,
        providerToken
      );

      if (googleResponse.status === "confirmed" && user) {
        try {
          const response = await axios.post(`/api/events/users/${user.id}`, {
            eventId: id,
            userId: user.id,
          });

          if (response.status === 200 || response.status === 201) {
            console.log("UserEvent inCalendar status updated successfully");
            toast({
              title: "Event added to Google Calendar",
              description: `This event has now been added to your Google Calendar`,
            });
            setUserEvents((currentEvents: UserEvent[]) =>
              (currentEvents || []).map((event: UserEvent) =>
                event.eventData.id === id
                  ? { ...event, inCalendar: true }
                  : event
              )
            );
          } else {
            console.error("Error updating inCalendar status:", response.data);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Error updating inCalendar status:",
              error.response?.data || error.message
            );
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error creating calendar event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/events/${id}`)}>
          <SquareArrowRightIcon className="h-4 w-4 mr-2" />
          View Event Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createCalendarEvent} disabled={inCalendar}>
          {loading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex flex-row">
              <Icons.google className="h-4 w-4 mr-2" />
              Add to Calendar
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
