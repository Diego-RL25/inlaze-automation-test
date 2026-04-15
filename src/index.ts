import { fetchCampaigns } from "./api/fetchCampaigns";
import { transformData } from "./services/transform";
import { saveToFile } from "./utils/save";
import { generateCampaignSummary } from "./services/llm";
import axios from "axios";

async function main() {
  try {
    console.log("Fetching campaigns...");
    const rawData = await fetchCampaigns();

    console.log("Transforming data...");
    const reports = transformData(rawData);

    console.log("Saving results...");
    saveToFile(reports);

    console.log("Sending data to n8n webhook...");
    await axios.post(
      "https://n8n-n8n.yqyj87.easypanel.host/webhook/campaigns",
      reports,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    console.log("Generating AI summary...");
    const summary = await generateCampaignSummary(reports);

    console.log("🧠 AI Summary:");
    console.log(summary.summary);

    console.log("✅ Done");
  } catch (error) {
    console.error("❌ Error in pipeline:", error);
  }
}

main();