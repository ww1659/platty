import axios from "axios";

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
