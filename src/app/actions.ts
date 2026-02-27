'use server';

import { generateClimateInsights, type GenerateClimateInsightsInput } from '@/ai/flows/generate-climate-insights';
import { z } from 'zod';

const ActionInputSchema = z.object({
  climateDataSummary: z.string(),
});

export async function getAiInsights(input: GenerateClimateInsightsInput) {
  const parsedInput = ActionInputSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input');
  }

  try {
    const insights = await generateClimateInsights(parsedInput.data);
    return insights;
  } catch (error) {
    console.error('AI Insight Generation Error:', error);
    throw new Error('Failed to generate AI insights. The AI model may be temporarily unavailable.');
  }
}
