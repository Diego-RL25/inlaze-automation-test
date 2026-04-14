export type CampaignReport = {
    id: string;
    name: string;
    metric: number;
    status: 'ok' | 'warning' | 'critical';
    evaluatedAt: Date;
  };