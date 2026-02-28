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

const GenerateFutureOutlookInputSchema = z.object({
  region: z.string(),
  temperatureData: z.array(DataPointSchema),
  co2Data: z.array(DataPointSchema),
  seaLevelData: z.array(DataPointSchema),
  arcticIceData: z.array(DataPointSchema),
  extremeWeatherEventsData: z.array(DataPointSchema),
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

Analyze the provided historical data to identify key trends and correlations between the different datasets. Based on these trends, project the likely future scenario.

Your summary should be structured and easy to read. Use markdown for formatting. Include the following sections:
- **Overall Outlook:** A brief, high-level summary of the climate trajectory for the region.
- **Key Trend Analysis:** Discuss the most significant trends you observe in the data (e.g., accelerating temperature rise, correlation with CO2).
- **Projected Impacts by 2040:** Describe the potential real-world impacts for the region based on the data trends (e.g., more frequent heatwaves, coastal risks, ecosystem changes).
- **Policy Recommendations:** Suggest 2-3 high-level policy considerations for policymakers in the region to mitigate the negative impacts.

Here is the historical data:
- Temperature Anomaly (°C): {{{JSON.stringify(temperatureData)}}}
- Atmospheric CO2 (ppm): {{{JSON.stringify(co2Data)}}}
- Sea Level Rise (mm): {{{JSON.stringify(seaLevelData)}}}
- Arctic Ice Extent (million km²): {{{JSON.stringify(arcticIceData)}}}
- Extreme Weather Events (count): {{{JSON.stringify(extremeWeatherEventsData)}}}
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
