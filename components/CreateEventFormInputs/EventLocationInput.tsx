"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { EventFormValues } from "@/types/EventFormValues";

interface EventLocationInputProps {
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setSidebarItems: Function;
  setStep: Function;
}

const formSchema = z.object({
  eventLocation: z.string().min(2).max(100),
});

export function EventLocationInput({
  setValue,
  step,
  setStep,
  setSidebarItems,
}: EventLocationInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventLocation: "",
    },
  });

  function eventLocationSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step ? { ...item, complete: true } : item
      )
    );
    setValue((currentValues: any) => ({
      ...currentValues,
      eventLocation: values.eventLocation,
    }));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(eventLocationSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="eventLocation"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Location</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
