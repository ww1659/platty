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

interface CreateEventFormProps {
  setSidebarItems: Dispatch<SetStateAction<SidebarItems[]>>;
  step: number;
  setStep: Function;
  communityId: string;
}

export function CreateEventForm({
  setSidebarItems,
  step,
  setStep,
  communityId,
}: CreateEventFormProps) {
  const { user } = useAuth();
  const [eventFormValues, setEventFormValues] = useState<EventFormValues>({
    eventName: "",
    eventTagline: "",
    eventDescription: "",
    eventPrice: 0.0,
    eventLocation: "",
    eventStartDate: new Date(),
    eventEndDate: new Date(),
    eventImage: "",
  });

  function handleCreateEvent() {
    const userId = user?.id;
    const eventData = {
      ...eventFormValues,
      userId,
    };
    console.log(eventData);

    try {
      axios
        .post(`/api/create-event/${communityId}`, eventData)
        .then((response) => {
          console.log("Event created successfully:", response.data);
          // Reset form values or navigate to another page
        })
        .catch((error) => {
          console.error("Error creating event:", error);
          // Handle error
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
          <p>{eventFormValues.eventName}</p>
          <p>{eventFormValues.eventTagline}</p>
          <p>{eventFormValues.eventDescription}</p>
          <p>{eventFormValues.eventPrice}</p>
          <p>{eventFormValues.eventLocation}</p>
          <p>{eventFormValues.eventStartDate.toLocaleDateString()}</p>
          <p>{eventFormValues.eventEndDate.toLocaleDateString()}</p>
          <p>{eventFormValues.eventImage}</p>

          {<Button onClick={handleCreateEvent}>Create Event</Button>}
        </div>
      )}
    </>
  );
}
