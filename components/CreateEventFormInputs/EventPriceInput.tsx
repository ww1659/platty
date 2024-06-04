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
  eventPrice: z.coerce.number(),
});

interface EventPriceProps {
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setSidebarItems: Function;
  setStep: Function;
}

export function EventPriceInput({
  setValue,
  step,
  setStep,
  setSidebarItems,
}: EventPriceProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventPrice: 0,
    },
  });

  function eventPriceSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step
          ? { ...item, complete: true, value: values.eventPrice }
          : item
      )
    );
    setValue((currentValues: any) => ({
      ...currentValues,
      eventPrice: values.eventPrice,
    }));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(eventPriceSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="eventPrice"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Price</FormLabel>
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
