'use server';
/**
 * @fileOverview A flow for generating a future outlook report based on climate data.
 *
 * - generateFutureOutlook - A function that generates a narrative report.
 * - GenerateFutureOutlookInput - The input type for the function.
 * - GenerateFutureOutlookOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataPointSchema = z.object({
  year: z.string(),
  value: z.number().nullable(),
});

const PredictedDataPointSchema = z.object({
  year: z.string(),
  value: z.number(),
});

const GenerateFutureOutlookInputSchema = z.object({
  region: z.string(),
  temperatureData: z.array(DataPointSchema),
  co2Data: z.array(DataPointSchema),
  seaLevelData: z.array(DataPointSchema),
  arcticIceData: z.array(DataPointSchema),
  extremeWeatherEventsData: z.array(DataPointSchema),
  predictedTemperatureData: z.array(PredictedDataPointSchema),
  predictedCo2Data: z.array(PredictedDataPointSchema),
  predictedSeaLevelData: z.array(PredictedDataPointSchema),
  predictedArcticIceData: z.array(PredictedDataPointSchema),
  predictedExtremeWeatherEventsData: z.array(PredictedDataPointSchema),
});
export type GenerateFutureOutlookInput = z.infer<typeof GenerateFutureOutlookInputSchema>;

export type GenerateFutureOutlookOutput = string;

export async function generateFutureOutlook(input: GenerateFutureOutlookInput): Promise<GenerateFutureOutlookOutput> {
  return generateFutureOutlookFlow(input);
}

const outlookPrompt = ai.definePrompt({
  name: 'generateFutureOutlookPrompt',
  input: { schema: GenerateFutureOutlookInputSchema },
  output: { schema: z.string() },
  prompt: `You are a climate scientist and policy advisor. Your task is to write a high-level executive summary about the future climate outlook for {{region}} up to the year 2040.

You have been provided with both historical data and AI-generated predictions for various climate metrics. Your analysis should be based on a combination of both. First, analyze the provided historical data to identify key trends and correlations. Then, use the AI predictions to project the likely future scenario and its impacts.

Your summary should be structured and easy to read. Use markdown for formatting. Include the following sections:
- **Overall Outlook:** A brief, high-level summary of the climate trajectory for the region based on both historical trends and future predictions.
- **Key Trend Analysis:** Discuss the most significant trends you observe in the historical data and how the predictions either continue or diverge from these trends. Mention any notable correlations between different datasets.
- **Projected Impacts by 2040:** Based on the combined historical and predicted data, describe the potential real-world impacts for the region (e.g., more frequent heatwaves, coastal risks, ecosystem changes). Be specific where possible, referencing the predicted values.
- **Policy Recommendations:** Suggest 2-3 high-level policy considerations for policymakers in the region to mitigate the negative impacts, informed by the data and projections.

Here is the data:

**Historical Data:**
- Temperature Anomaly (°C): {{{JSON.stringify(temperatureData)}}}
- Atmospheric CO2 (ppm): {{{JSON.stringify(co2Data)}}}
- Sea Level Rise (mm): {{{JSON.stringify(seaLevelData)}}}
- Arctic Ice Extent (million km²): {{{JSON.stringify(arcticIceData)}}}
- Extreme Weather Events (count): {{{JSON.stringify(extremeWeatherEventsData)}}}

**Predicted Data (up to 2040):**
- Temperature Anomaly (°C): {{{JSON.stringify(predictedTemperatureData)}}}
- Atmospheric CO2 (ppm): {{{JSON.stringify(predictedCo2Data)}}}
- Sea Level Rise (mm): {{{JSON.stringify(predictedSeaLevelData)}}}
- Arctic Ice Extent (million km²): {{{JSON.stringify(predictedArcticIceData)}}}
- Extreme Weather Events (count): {{{JSON.stringify(predictedExtremeWeatherEventsData)}}}
`,
});

const generateFutureOutlookFlow = ai.defineFlow(
  {
    name: 'generateFutureOutlookFlow',
    inputSchema: GenerateFutureOutlookInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await outlookPrompt(input);
    return output || 'No outlook could be generated.';
  }
);
