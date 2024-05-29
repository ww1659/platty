import axios from "axios";

type Event = {
  summary: string;
  description: string;
  start: {
    dateTime: Date;
    timezone: string;
  };
  end: {
    dateTime: Date;
    timezone: string;
  };
};

export async function fetchImage(keyword: string) {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: keyword,
        client_id: accessKey,
      },
    });
    console.log(response.data.results);
    return response.data.results;
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function postGoogleCalendarEvent(
  event: Event,
  token: string | null | undefined
) {
  try {
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      event,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error adding event to Google Calendar", error);
    throw error;
  }
}
