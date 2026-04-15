import axios from "axios";
import pLimit from "p-limit";

export type Campaign = {
  id: string;
  clicks: number;
  impressions: number;
  ctr: number;
};

// 🔹 Fetch individual campaign with error handling
export async function fetchCampaignData(campaignId: string): Promise<Campaign | null> {
  try {
    const response = await axios.get(`https://api.example.com/campaigns/${campaignId}`);
    const data = response.data;

    if (
      !data ||
      typeof data.clicks !== "number" ||
      typeof data.impressions !== "number"
    ) {
      throw new Error("Invalid API response format");
    }

    const impressions = data.impressions;
    const clicks = data.clicks;

    // Avoid division by zero
    const ctr = impressions === 0 ? 0 : clicks / impressions;

    return {
      id: data.id,
      clicks,
      impressions,
      ctr
    };

  } catch (error) {
    console.error(`Error fetching campaign ${campaignId}:`, error);
    return null;
  }
}

// 🔹 Process campaigns with controlled concurrency
export async function processCampaigns(ids: string[]) {
  const limit = pLimit(3); // max 3 concurrent requests

  const tasks = ids.map(id =>
    limit(() => fetchCampaignData(id))
  );

  const results = await Promise.all(tasks);

  return results.filter((c): c is Campaign => c !== null);
}

// 🔹 Business logic: low CTR campaigns
export function getLowCTR(campaigns: Campaign[]) {
  return campaigns
    .filter(c => c.ctr < 0.02)
    .sort((a, b) => a.ctr - b.ctr);
}