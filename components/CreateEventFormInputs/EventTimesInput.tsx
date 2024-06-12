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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from ".././TimePicker";

import { Dispatch, SetStateAction, useState } from "react";
import { EventFormValues } from "@/types/EventFormValues";

interface EventTimingInputProps {
  value: EventFormValues;
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setSidebarItems: Function;
  setStep: Function;
}

const formSchema = z
  .object({
    eventStartDate: z.date({
      required_error: "A start date is required.",
    }),
    eventEndDate: z.date({
      required_error: "An end date is required.",
    }),
  })
  .refine((data) => data.eventEndDate > data.eventStartDate, {
    message: "End date must be after start date",
    path: ["eventEndDate"],
  });

export function EventTimingsInput({
  value,
  setValue,
  step,
  setStep,
  setSidebarItems,
}: EventTimingInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventStartDate: undefined,
      eventEndDate: undefined,
    },
  });

  function eventTimingsSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step ? { ...item, complete: true } : item
      )
    );
    setValue((currentValues: any) => ({
      ...currentValues,
      eventStartDate: values.eventStartDate,
      eventEndDate: values.eventEndDate,
    }));
  }

  const startDate = form.watch("eventStartDate");
  console.log(startDate);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(eventTimingsSubmit)}>
        <div>
          <div className="flex flex-row justify-start">
            <div>
              <FormField
                control={form.control}
                name="eventStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left">Start</FormLabel>
                    {/* <Popover open={true}> */}
                    <FormControl>
                      {/* <PopoverTrigger asChild> */}
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm")
                        ) : (
                          <span>Select a date and time</span>
                        )}
                      </Button>
                      {/* </PopoverTrigger> */}
                    </FormControl>
                    {/* <PopoverContent className="w-auto p-0"> */}
                    <Calendar
                      className="border"
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker setDate={field.onChange} date={field.value} />
                    </div>
                    {/* </PopoverContent>
                    </Popover> */}
                  </FormItem>
                )}
              />
            </div>

            {startDate !== undefined ? (
              <div className="ml-10">
                <FormField
                  control={form.control}
                  name="eventEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-left">End</FormLabel>
                      {/* <Popover open={true}> */}
                      <FormControl>
                        {/* <PopoverTrigger asChild> */}
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Select a date and time</span>
                          )}
                        </Button>
                        {/* </PopoverTrigger> */}
                      </FormControl>
                      {/* <PopoverContent className="w-auto p-0"> */}
                      <Calendar
                        className="border"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          startDate
                            ? date < new Date() || date < startDate
                            : date < new Date()
                        }
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                      {/* </PopoverContent>
                    </Popover> */}
                    </FormItem>
                  )}
                />
              </div>
            ) : null}
          </div>

          <Button type="submit" className="mt-5">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
