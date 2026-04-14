import { fetchCampaigns } from "./api/fetchCampaigns";
import { transformData } from "./services/transform";
import { saveToFile } from "./utils/save";

async function main() {
  try {
    console.log("Fetching campaigns...");

    const rawData = await fetchCampaigns();

    console.log("Transforming data...");
    const reports = transformData(rawData);

    console.log("Saving results...");
    saveToFile(reports);

    console.log("✅ Done");
  } catch (error) {
    console.error("❌ Error in pipeline:", error);
  }
}

main();