import * as fs from "fs";
import { CampaignReport } from "../types/campaign";

export function saveToFile(data: CampaignReport[]) {
  try {
    fs.writeFileSync(
      "data/reports.json",
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error("Error saving file:", error);
  }
}