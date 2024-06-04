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
  eventName: z.string().min(2).max(50),
});

interface EventNameProps {
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setSidebarItems: Function;
  setStep: Function;
}

export function EventNameInput({
  setValue,
  step,
  setStep,
  setSidebarItems,
}: EventNameProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
    },
  });

  function eventNameSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step
          ? { ...item, complete: true, value: values.eventName }
          : item
      )
    );
    setValue((currentValues: any) => ({
      ...currentValues,
      eventName: values.eventName,
    }));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(eventNameSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Name</FormLabel>
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
