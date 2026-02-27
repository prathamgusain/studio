'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI-powered insights from climate data.
 *
 * - generateClimateInsights - A function that analyzes selected climate data to identify trends, anomalies, and potential future impacts.
 * - GenerateClimateInsightsInput - The input type for the generateClimateInsights function.
 * - GenerateClimateInsightsOutput - The return type for the generateClimateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateClimateInsightsInputSchema = z.object({
  climateDataSummary: z.string().describe(
    "A comprehensive summary of selected climate data, which may include specific data points, time ranges, geographic regions, and parameters (e.g., 'Selected data for Global temperature and CO2 levels from 1980-2023 shows average temperature increased by 1.2C and CO2 by 50ppm.')."
  )
});
export type GenerateClimateInsightsInput = z.infer<typeof GenerateClimateInsightsInputSchema>;

// Output Schema
const GenerateClimateInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise overview of the climate data provided.'),
  trends: z.array(z.string()).describe('A list of significant trends identified in the climate data.'),
  anomalies: z.array(z.string()).describe('A list of detected anomalies or outliers in the climate data.'),
  futureImpacts: z.array(z.string()).describe('A list of potential future impacts based on the analysis of the climate data.')
});
export type GenerateClimateInsightsOutput = z.infer<typeof GenerateClimateInsightsOutputSchema>;

// Wrapper function
export async function generateClimateInsights(input: GenerateClimateInsightsInput): Promise<GenerateClimateInsightsOutput> {
  return generateClimateInsightsFlow(input);
}

// Prompt definition
const generateClimateInsightsPrompt = ai.definePrompt({
  name: 'generateClimateInsightsPrompt',
  input: {schema: GenerateClimateInsightsInputSchema},
  output: {schema: GenerateClimateInsightsOutputSchema},
  prompt: `You are an expert climate data analyst. Your task is to analyze the provided summary of raw climate datasets and extract key insights.
The summary includes starting and ending values for different climate indicators over a specified time period and region.
Based on this information, identify significant trends, detect potential anomalies or outliers, and predict potential future impacts.
Your analysis should consider the relationships between the different datasets (e.g., how temperature changes might correlate with CO2 levels).

Format your response as a JSON object with the following fields: 'summary', 'trends', 'anomalies', and 'futureImpacts'.
The 'trends', 'anomalies', and 'futureImpacts' fields should be arrays of strings.

Climate Data Summary:
{{{climateDataSummary}}}`
});

// Flow definition
const generateClimateInsightsFlow = ai.defineFlow(
  {
    name: 'generateClimateInsightsFlow',
    inputSchema: GenerateClimateInsightsInputSchema,
    outputSchema: GenerateClimateInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await generateClimateInsightsPrompt(input);
    return output!;
  }
);
