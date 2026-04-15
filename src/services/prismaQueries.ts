import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CampaignWithAvgRoas = {
  campaignId: string;
  campaignName: string;
  avgRoas: number;
};

type OperatorResult = {
  operatorId: string;
  operatorName: string;
  campaigns: CampaignWithAvgRoas[];
};

export async function getWorstPerformingCampaigns(): Promise<OperatorResult[]> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const operators = await prisma.operator.findMany({
      include: {
        campaigns: {
          include: {
            metrics: {
              where: {
                recordedAt: {
                  gte: sevenDaysAgo,
                },
              },
            },
          },
        },
      },
    });

    // 🔥 tipo inferido automáticamente
    type OperatorWithRelations = typeof operators[number];

    const result: OperatorResult[] = operators.map((operator: OperatorWithRelations) => {
      const campaigns: CampaignWithAvgRoas[] = operator.campaigns.map((campaign: { metrics: any; id: any; name: any; }) => {
        const metrics = campaign.metrics;

        const avgRoas =
          metrics.length === 0
            ? 0
            : metrics.reduce((sum: any, m: { roas: any; }) => sum + m.roas, 0) / metrics.length;

        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          avgRoas,
        };
      });

      campaigns.sort((a, b) => a.avgRoas - b.avgRoas);

      return {
        operatorId: operator.id,
        operatorName: operator.name,
        campaigns,
      };
    });

    return result;

  } catch (error) {
    console.error("Error fetching worst performing campaigns:", error);
    throw new Error("Failed to retrieve campaign performance data");
  } finally {
    await prisma.$disconnect();
  }
}