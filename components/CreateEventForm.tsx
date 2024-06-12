"use client";

import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";

import { EventNameInput } from "./CreateEventFormInputs/EventNameInput";
import { EventDescriptionInput } from "./CreateEventFormInputs/EventDescriptionInput";
import { EventLocationInput } from "./CreateEventFormInputs/EventLocationInput";
import { EventTimingsInput } from "./CreateEventFormInputs/EventTimesInput";
import { EventImageInput } from "./CreateEventFormInputs/EventImageInput";
import { EventFormValues } from "@/types/EventFormValues";
import { SidebarItems } from "@/types/SidebarItems";
import axios from "axios";
import { EventTaglineInput } from "./CreateEventFormInputs/EventTaglineInput";
import { EventPriceInput } from "./CreateEventFormInputs/EventPriceInput";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/context/UserContext";
import EventCard from "./EventCard";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface CreateEventFormProps {
  setSidebarItems: Dispatch<SetStateAction<SidebarItems[]>>;
  step: number;
  setStep: Function;
  communityId: string | string[];
}

export function CreateEventForm({
  setSidebarItems,
  step,
  setStep,
  communityId,
}: CreateEventFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [eventFormValues, setEventFormValues] = useState<EventFormValues>({
    eventName: "",
    eventTagline: "",
    eventDescription: "",
    eventPrice: 0.0,
    eventLocation: "",
    eventStartDate: undefined,
    eventEndDate: undefined,
    eventImage: "",
  });

  function handleCreateEvent() {
    const userId = user?.id;
    const eventData = {
      ...eventFormValues,
      userId,
    };

    try {
      axios
        .post(`/api/create-event/${communityId}`, eventData)
        .then((response) => {
          console.log("Event created successfully:", response.data);
          toast({
            title: "Event Created",
            description: `New event created for ${communityId}`,
          });
          setEventFormValues({
            eventName: "",
            eventTagline: "",
            eventDescription: "",
            eventPrice: 0.0,
            eventLocation: "",
            eventStartDate: new Date(),
            eventEndDate: new Date(),
            eventImage: "",
          });
          router.push("/");
        })
        .catch((error) => {
          console.error("Error creating event:", error);
          toast({
            variant: "destructive",
            title: "Event Creation Failed",
            description: `Couldn't create event: ${error}`,
          });
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {step === 0 && (
        <EventNameInput
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
        />
      )}
      {step === 1 && (
        <EventTaglineInput
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
        />
      )}
      {step === 2 && (
        <EventDescriptionInput
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
        />
      )}
      {step === 3 && (
        <EventPriceInput
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
        />
      )}
      {step === 4 && (
        <EventLocationInput
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
        />
      )}
      {step === 5 && (
        <EventTimingsInput
          value={eventFormValues}
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
        />
      )}
      {step === 6 && (
        <EventImageInput
          setValue={setEventFormValues}
          step={step}
          setStep={setStep}
          setSidebarItems={setSidebarItems}
          eventName={eventFormValues.eventName}
        />
      )}

      {step === 7 && (
        <div>
          <div className="flex flex-row justify-start gap-5">
            <div className="">
              <h5 className="mb-2 font-bold underline">Event Card</h5>
              <EventCard
                eventTitle={eventFormValues.eventName}
                eventDescription={eventFormValues.eventDescription}
                eventLocation={eventFormValues.eventLocation}
                startTime={eventFormValues.eventStartDate}
                endTime={eventFormValues.eventEndDate}
                eventImage={eventFormValues.eventImage}
                eventPrice={parseFloat(eventFormValues.eventPrice.toString())}
              />
            </div>
            <div className="">
              <h5 className="mb-2 font-bold underline">Key Details</h5>
              <div className="flex flex-col border rounded-lg">
                <code>Event Name: {eventFormValues.eventName}</code>
                <code>
                  Start Time:
                  {eventFormValues.eventStartDate?.toLocaleDateString()}
                </code>
                <code>
                  End Time: {eventFormValues.eventEndDate?.toLocaleDateString()}
                </code>
                <code>Price: £{eventFormValues.eventPrice}</code>
                <code>Location: {eventFormValues.eventLocation}</code>
              </div>
            </div>
          </div>
          <Button onClick={handleCreateEvent} className="w-full mt-5">
            Create Event
          </Button>
        </div>
      )}
    </>
  );
}
