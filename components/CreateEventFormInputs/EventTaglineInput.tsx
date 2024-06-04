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

const formSchema = z.object({
  eventTagline: z.string().min(2).max(150),
});

interface EventTaglineProps {
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setSidebarItems: Function;
  setStep: Function;
}

export function EventTaglineInput({
  setValue,
  step,
  setStep,
  setSidebarItems,
}: EventTaglineProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventTagline: "",
    },
  });

  function eventTaglineSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step
          ? { ...item, complete: true, value: values.eventTagline }
          : item
      )
    );
    setValue((currentValues: any) => ({
      ...currentValues,
      eventTagline: values.eventTagline,
    }));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(eventTaglineSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="eventTagline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Tagline</FormLabel>
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
