"use client";

import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Event } from "@/types/Event";
import { useAuth } from "@/context/UserContext";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { EventFilterDateDropdown } from "@/components/EventFilterDateDropdown";
import { EventPriceFilterDropdown } from "@/components/EventFilterPriceDropdown";
import { EventCommunityFilterDropdown } from "@/components/EventFilterCommunitiesDropdown";
import { Input } from "@/components/ui/input";
import { Community } from "@/types/Community";
import { Button } from "@/components/ui/button";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
const lodash = require("lodash");

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [userCommunities, setUserCommunities] = useState<Community[] | []>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / 12);

  const { user, isLoading } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const [communityFilter, setCommunityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounce = lodash.debounce;

  const fetchEventsData = useCallback(
    debounce(
      async (
        dateFilter: string,
        communityFilter: string,
        priceFilter: string,
        searchQuery: string
      ) => {
        setEventsLoading(true);
        try {
          if (!user) {
            setEventsLoading(false);
            return;
          }

          const params = new URLSearchParams();
          params.append("userId", user.id);
          if (communityFilter) params.append("community", communityFilter);
          if (priceFilter) params.append("price", priceFilter);
          if (dateFilter) params.append("month", dateFilter);
          if (searchQuery) params.append("search", searchQuery);

          const response = await axios.get(`/api/events?${params.toString()}`);
          const events = response.data;
          setEvents(events);
        } catch (error) {
          console.error("Error fetching event data:", error);
        } finally {
          setEventsLoading(false);
        }
      },
      300
    ),
    []
  );

  useEffect(() => {
    fetchEventsData(dateFilter, communityFilter, priceFilter, searchQuery);
  }, [dateFilter, communityFilter, priceFilter, searchQuery, fetchEventsData]);

  useEffect(() => {
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
  }, [user?.id]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentEvents = events.slice((currentPage - 1) * 12, currentPage * 12);

  if (user === undefined || user === null || isLoading) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-start justify-start container">
      <div className="flex flex-row w-full justify-between items-center mt-5 mt-5 pb-3 mb-5 border-b">
        <div className="flex flex-row gap-5 items-center">
          <h3>Upcoming Events</h3>
          <EventPriceFilterDropdown
            value={priceFilter}
            setValue={setPriceFilter}
          />
          <EventFilterDateDropdown
            value={dateFilter}
            setValue={setDateFilter}
          />
          {communitiesLoading || userCommunities.length === 0 ? null : (
            <EventCommunityFilterDropdown
              value={communityFilter}
              setValue={setCommunityFilter}
              userCommunities={userCommunities}
            />
          )}
        </div>
        <div className="flex flex-row gap-5">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Or search for an event..."
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end space-x-2 pb-4 w-full">
        <p className="text-xs">
          Showing {currentEvents.length} of {events.length} results
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous{" "}
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next{" "}
        </Button>
      </div>

      {eventsLoading ? (
        <div className="flex justify-center flex-row flex-wrap gap-5 my-5">
          {Array.from({ length: 12 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-row justify-center flex-wrap gap-5 mb-10">
          {events.length === 0 ? (
            <h3>Sorry, no events matched your search...</h3>
          ) : (
            currentEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id}>
                <EventCard
                  eventTitle={event.title}
                  eventDescription={event.description}
                  eventLocation={event.location}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  eventImage={event.imageUrl}
                  eventPrice={parseFloat(event.price.toString())}
                />
              </Link>
            ))
          )}
        </div>
      )}
    </main>
  );
}
