import { CampaignReport } from "../types/campaign";

export function transformData(data: any[]): CampaignReport[] {
  return data.slice(0, 10).map(item => {
    const metric = Number((Math.random() * 5).toFixed(2));

    let status: CampaignReport["status"];

    if (metric < 1) {
      status = "critical";
    } else if (metric < 2.5) {
      status = "warning";
    } else {
      status = "ok";
    }

    return {
      id: String(item.id),
      name: item.title ?? "Unknown",
      metric,
      status,
      evaluatedAt: new Date()
    };
  });
}