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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EventFormValues } from "@/types/EventFormValues";
import axios from "axios";
import { UnsplashImage } from "../UnsplashImageCard";

interface EventImageInputProps {
  setValue: Dispatch<SetStateAction<EventFormValues>>;
  step: number;
  setSidebarItems: Function;
  setStep: Function;
  eventName: string;
}

const formSchema = z.object({
  eventImage: z.string().url().optional(),
});

export function EventImageInput({
  setValue,
  step,
  setStep,
  setSidebarItems,
  eventName,
}: EventImageInputProps) {
  const [sampleImages, setSampleImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     setLoadingImages(true);
  //     try {
  //       const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  //       const response = await axios.get(
  //         `https://api.unsplash.com/search/photos`,
  //         {
  //           params: {
  //             query: eventName,
  //             orientation: "landscape",
  //             client_id: accessKey,
  //           },
  //         }
  //       );
  //       console.log(response.data.results);
  //       setSampleImages(response.data.results);
  //     } catch (error) {
  //       console.error("Error fetching images data:", error);
  //     } finally {
  //       setLoadingImages(false);
  //     }
  //   };

  //   fetchImages();
  // }, [eventName]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error fetching images data:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventImage: "",
    },
  });

  function eventImageSubmit(values: z.infer<typeof formSchema>) {
    setStep((currentStep: number) => currentStep + 1);
    setSidebarItems((currentItems: any) =>
      currentItems.map((item: any, index: number) =>
        index === step ? { ...item, complete: true } : item
      )
    );
  }

  function handleImageClick(imageUrl: string) {
    setValue((prevValues) => ({
      ...prevValues,
      eventImage: imageUrl,
    }));
  }

  function handleSearchChange(e: any) {
    setSearchKeyword(e.target.value);
  }

  return (
    <div>
      <div className="flex flex-row mb-5">
        <Input
          type="text"
          className="px-3 py-2 w-80"
          placeholder="Search for an image..."
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <Button className="px-3 py-2 ml-3" onClick={handleSubmit}>
          Search
        </Button>
      </div>

      {loadingImages ? (
        <p>Loading Images</p>
      ) : (
        <div className="flex flex wrap gap-3">
          {sampleImages.map((image: any) => (
            <div key={image.id}>
              <div
                className="cursor-pointer"
                onClick={() => handleImageClick(image.urls.regular)}
              >
                <UnsplashImage
                  imageSrc={image.urls.regular}
                  imageDesc={image.description}
                  height={200}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(eventImageSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="eventImage"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Review</Button>
        </form>
      </Form>
    </div>
  );
}
