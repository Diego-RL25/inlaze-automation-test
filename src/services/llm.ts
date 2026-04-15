import axios from "axios";
import { CampaignReport } from "../types/campaign";

type LLMResponse = {
  summary: string;
};

export async function generateCampaignSummary(
  campaigns: CampaignReport[]
): Promise<LLMResponse> {
  try {
    // 🔹 Preprocesar datos (importante para costo y claridad)
    const critical = campaigns.filter(c => c.status === "critical");
    const warning = campaigns.filter(c => c.status === "warning");

    const prompt = `
You are a marketing analyst.

Analyze the following campaign data and produce a concise executive summary.

Requirements:
- Highlight critical campaigns
- Summarize the overall state of warning campaigns
- Suggest at least one concrete action

Campaign data:
${JSON.stringify(campaigns, null, 2)}

Respond ONLY in this JSON format:
{
  "summary": "your summary here"
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty LLM response");
    }

    // 🔹 Intentar parsear respuesta
    const parsed: LLMResponse = JSON.parse(content);

    if (!parsed.summary) {
      throw new Error("Invalid LLM format");
    }

    return parsed;

  } catch (error) {
    console.error("LLM Error:", error);

    // 🔹 fallback seguro (NO romper sistema)
    return {
      summary:
        "Unable to generate AI summary at the moment. Please review campaign performance manually."
    };
  }
}