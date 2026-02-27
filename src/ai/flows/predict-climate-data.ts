'use server';
/**
 * @fileOverview A flow for predicting climate data.
 *
 * - predictClimateData - A function that predicts climate data up to 2040.
 * - PredictClimateDataInput - The input type for the predictClimateData function.
 * - PredictClimateDataOutput - The return type for the predictClimateData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataPointSchema = z.object({
  year: z.string(),
  value: z.number().nullable(),
});

const PredictClimateDataInputSchema = z.object({
  dataType: z.string().describe('The type of climate data (e.g., Temperature Anomaly).'),
  data: z.array(DataPointSchema).describe('The historical climate data.'),
});
export type PredictClimateDataInput = z.infer<typeof PredictClimateDataInputSchema>;

const PredictClimateDataOutputSchema = z.array(z.object({
    year: z.string(),
    value: z.number(),
}));
export type PredictClimateDataOutput = z.infer<typeof PredictClimateDataOutputSchema>;

export async function predictClimateData(input: PredictClimateDataInput): Promise<PredictClimateDataOutput> {
  return predictClimateDataFlow(input);
}

const predictionPrompt = ai.definePrompt({
  name: 'predictClimateDataPrompt',
  input: { schema: PredictClimateDataInputSchema },
  output: { schema: PredictClimateDataOutputSchema },
  prompt: `You are a climate data scientist. Your task is to perform a time-series prediction.
Based on the following historical data for '{{dataType}}', predict the values for each year from the end of the provided data up to the year 2040.
Analyze the trend in the data to make your predictions. The historical data might have null values, which you should ignore.
Ensure your prediction continues the trend from the last available valid data point.
Return the predictions as a JSON array of objects, where each object has a "year" (string) and a "value" (number).

Historical Data:
{{{JSON.stringify(data)}}}
`,
});

const predictClimateDataFlow = ai.defineFlow(
  {
    name: 'predictClimateDataFlow',
    inputSchema: PredictClimateDataInputSchema,
    outputSchema: PredictClimateDataOutputSchema,
  },
  async (input) => {
    const { output } = await predictionPrompt(input);
    return output || [];
  }
);
