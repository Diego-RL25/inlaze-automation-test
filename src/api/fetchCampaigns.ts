import axios from "axios";

export async function fetchCampaigns(retries = 3, delay = 500): Promise<any[]> {
  try {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");

    if (!res.data || !Array.isArray(res.data)) {
      throw new Error("Invalid API response");
    }

    return res.data;

  } catch (error) {
    if (retries === 0) {
      throw new Error("API failed after retries");
    }

    await new Promise(res => setTimeout(res, delay));

    return fetchCampaigns(retries - 1, delay * 2);
  }
}