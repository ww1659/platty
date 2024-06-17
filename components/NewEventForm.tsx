"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CalendarIcon,
} from "lucide-react";
import { TimePicker } from "./TimePicker";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { UnsplashImage } from "./UnsplashImageCard";
import { EventFormValues } from "@/types/EventFormValues";
import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

const formSchema = z
  .object({
    eventName: z
      .string()
      .min(2, {
        message: "Event name must be at least 2 characters.",
      })
      .max(50, {
        message: "Event name must not be longer than 50 characters.",
      }),
    eventTagline: z
      .string()
      .min(2, {
        message: "Event tagline must be at least 2 characters.",
      })
      .max(50, {
        message: "Event tagline must not be longer than 50 characters.",
      }),
    eventDescription: z
      .string()
      .min(10, {
        message: "Description must be at least 10 characters.",
      })
      .max(300, {
        message: "Description must not be longer than 300 characters.",
      }),
    eventPrice: z.coerce.number(),
    eventLocation: z.string().min(2).max(100),
    eventStartDate: z.date({
      required_error: "A start date is required.",
    }),
    eventEndDate: z.date({
      required_error: "An end date is required.",
    }),
    eventImage: z.string().url().optional(),
  })
  .refine((data) => data.eventEndDate > data.eventStartDate, {
    message: "End date must be after start date",
    path: ["eventEndDate"],
  });

interface SetFormValuesProps {
  setEventName: Dispatch<SetStateAction<string | undefined>>;
  setEventTagline: Dispatch<SetStateAction<string | undefined>>;
  setEventDescription: Dispatch<SetStateAction<string | undefined>>;
  setEventPrice: Dispatch<SetStateAction<number | undefined>>;
  setEventLocation: Dispatch<SetStateAction<string | undefined>>;
  setEventStartDate: Dispatch<SetStateAction<Date | undefined>>;
  setEventEndDate: Dispatch<SetStateAction<Date | undefined>>;
  setEventImage: Dispatch<SetStateAction<string | undefined>>;
  communityId: string | string[];
  communityName: string | undefined;
}

type SampleImage = {
  id: string;
  urls: {
    regular: string;
  };
  description: string;
};

export function NewEventForm({
  setEventName,
  setEventTagline,
  setEventDescription,
  setEventPrice,
  setEventLocation,
  setEventStartDate,
  setEventEndDate,
  setEventImage,
  communityId,
  communityName,
}: SetFormValuesProps) {
  const [sampleImages, setSampleImages] = useState<SampleImage[] | []>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reelStartIndex, setReelStartIndex] = useState(0);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sampleImages.length > 0) {
      setSelectedImageUrl(sampleImages[currentImageIndex]?.urls?.regular);
    }
  }, [currentImageIndex, sampleImages]);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sampleImages.length);
    setReelStartIndex(
      (prevStartIndex) => (prevStartIndex + 1) % sampleImages.length
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + sampleImages.length) % sampleImages.length
    );
    setReelStartIndex(
      (prevStartIndex) =>
        (prevStartIndex - 1 + sampleImages.length) % sampleImages.length
    );
  };

  const getReelImages = () => {
    const reelImages = [];
    for (let i = 0; i < 3; i++) {
      const index = (reelStartIndex + i) % sampleImages.length;
      reelImages.push(sampleImages[index]);
    }
    return reelImages;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventTagline: "",
      eventDescription: "",
      eventPrice: 0,
      eventLocation: "",
      eventStartDate: undefined,
      eventEndDate: undefined,
      eventImage: "",
    },
  });

  const handleImagesSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingImages(true);
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: searchKeyword,
            orientation: "landscape",
            client_id: accessKey,
          },
        }
      );
      setSampleImages(response.data.results);
      setImageDialogOpen(true);
    } catch (error) {
      console.error("Error fetching images data:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  function handleSearchChange(e: any) {
    setSearchKeyword(e.target.value);
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleImageConfirm = () => {
    form.setValue("eventImage", selectedImageUrl);
    setImageDialogOpen(false);
  };

  useEffect(() => {
    const subscription = form.watch((values) => {
      setEventName(values.eventName);
      setEventTagline(values.eventTagline);
      setEventDescription(values.eventDescription);
      setEventPrice(values.eventPrice);
      setEventLocation(values.eventLocation);
      setEventStartDate(values.eventStartDate);
      setEventEndDate(values.eventEndDate);
      setEventImage(values.eventImage);
    });
    return () => subscription.unsubscribe();
  }, [
    setEventDescription,
    setEventEndDate,
    setEventImage,
    setEventLocation,
    setEventName,
    setEventTagline,
    setEventPrice,
    setEventStartDate,
    setEventImage,
    form,
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userId = user?.id;
    const eventData = {
      ...values,
      userId,
    };

    try {
      axios
        .post(`/api/create-event/${communityId}`, eventData)
        .then((response) => {
          console.log("Event created successfully:", response.data);
          toast({
            title: "Event Created!",
            variant: "default",
            description: `New event created for ${communityName}`,
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

  const startDate = form.watch("eventStartDate");
  const endDate = form.watch("eventEndDate");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div
          id="name_tagline"
          className="flex flex-row justify-start items-center gap-5"
        >
          <div className="w-full">
            {" "}
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your event name..." {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            {" "}
            <FormField
              control={form.control}
              name="eventTagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="A punchy one-liner..." {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="eventDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A bit more information about your event"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div
          id="price_location"
          className="flex flex-row justify-start items-center gap-5"
        >
          <div className="w-full">
            {" "}
            <FormField
              control={form.control}
              name="eventPrice"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Price</FormLabel>
                  <FormControl>
                    <Input placeholder="2.50" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="eventLocation"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>{" "}
        </div>

        <div
          id="start_end_time"
          className="flex flex-row justify-start items-center gap-5"
        >
          <div className="w-full">
            {" "}
            <FormField
              control={form.control}
              name="eventStartDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">Start</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
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
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        className="border"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="eventEndDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">End</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger
                        asChild
                        disabled={startDate === undefined ? true : false}
                      >
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
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
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        className="border"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          startDate
                            ? date < subDays(new Date(startDate), 1)
                            : date < new Date()
                        }
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                          startDate={startDate}
                          endDate={endDate}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <div className="flex flex-row gap-2 w-full">
            <Input
              type="text"
              placeholder="Type in a keyword for your event and hit search..."
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <Button
              className="px-3 py-2 ml-3"
              onClick={handleImagesSubmit}
              disabled={loadingImages}
            >
              Search Images
            </Button>
          </div>

          <Dialog open={imageDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Event Image</DialogTitle>
                <DialogDescription>
                  Browse and select an image to use for your event. Click the
                  image and then confirm when you&apos;re done!
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap items-center justify-center m-1">
                {!loadingImages && sampleImages.length > 0 && (
                  <>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        onClick={handlePrev}
                        className="p-2 m-2"
                      >
                        <ArrowLeftCircleIcon className="h-6 w-6" />
                      </Button>
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            sampleImages[currentImageIndex]?.urls?.regular
                          )
                        }
                      >
                        <UnsplashImage
                          imageSrc={
                            sampleImages[currentImageIndex].urls.regular
                          }
                          imageDesc={
                            sampleImages[currentImageIndex].description
                          }
                          height={200}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleNext}
                        className="p-2 m-2"
                      >
                        <ArrowRightCircleIcon className="h-6 w-6" />
                      </Button>
                    </div>
                    {/* <div className="flex mt-4 space-x-2 p-5">
                      {getReelImages().map((image, index) => (
                        <div
                          key={image.id}
                          className="rounded-lg"
                          onClick={() =>
                            setCurrentImageIndex(
                              (reelStartIndex + index) % sampleImages.length
                            )
                          }
                        >
                          <UnsplashImage
                            imageSrc={image.urls.regular}
                            imageDesc={image.description}
                            height={10}
                          />
                        </div>
                      ))}
                    </div> */}
                  </>
                )}
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <div className="flex flex-row justify-between w-full">
                    <Button
                      type="button"
                      onClick={() => setImageDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button type="button" onClick={handleImageConfirm}>
                      Confirm
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <FormField
            control={form.control}
            name="eventImage"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Input className="hidden" placeholder="" {...field} />
                </FormControl>
                {/* <FormMessage className="text-xs" /> */}
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full" type="submit">
          Create New Event
        </Button>
      </form>
    </Form>
  );
}
