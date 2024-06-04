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

interface EventDescriptionInputProps {
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setStep: Function;
  setSidebarItems: Function;
}
const formSchema = z.object({
  eventDescription: z.string().min(2).max(1000),
});

export function EventDescriptionInput({
  setValue,
  step,
  setStep,
  setSidebarItems,
}: EventDescriptionInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDescription: "",
    },
  });

  function eventDescriptionSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step ? { ...item, complete: true } : item
      )
    );
    setValue((currentValues: any) => ({
      ...currentValues,
      eventDescription: values.eventDescription,
    }));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(eventDescriptionSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="eventDescription"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Description</FormLabel>
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
