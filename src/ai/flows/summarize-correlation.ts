'use server';
/**
 * @fileOverview A flow to summarize climate data correlation.
 *
 * - summarizeCorrelation - A function that provides an AI-powered summary of a correlation analysis.
 * - SummarizeCorrelationInput - The input type for the summarizeCorrelation function.
 * - SummarizeCorrelationOutput - The return type for the summarizeCorrelation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCorrelationInputSchema = z.object({
  metric1: z.string().describe('The name of the first climate metric.'),
  metric2: z.string().describe('The name of the second climate metric.'),
  correlation: z.number().nullable().describe('The calculated Pearson correlation coefficient (r).'),
  interpretation: z.string().describe('The text interpretation of the correlation strength and direction.'),
});
export type SummarizeCorrelationInput = z.infer<typeof SummarizeCorrelationInputSchema>;

export type SummarizeCorrelationOutput = string;

export async function summarizeCorrelation(input: SummarizeCorrelationInput): Promise<SummarizeCorrelationOutput> {
  return summarizeCorrelationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCorrelationPrompt',
  input: {schema: SummarizeCorrelationInputSchema},
  output: {format: 'text'},
  prompt: `You are a climate data analyst. Your task is to provide a brief, insightful summary based on the correlation between two climate metrics.

The user has analyzed the relationship between "{{metric1}}" and "{{metric2}}".

The calculated Pearson correlation coefficient is: r = {{correlation}}
This indicates a "{{interpretation}}" correlation.

Based on this information, provide a one-paragraph summary (2-3 sentences) explaining what this correlation means in a real-world context for a policymaker. Do not repeat the input values. Explain the potential implications of this relationship. If the correlation is weak or non-existent, state that clearly and suggest that other factors are likely at play.`,
});

const summarizeCorrelationFlow = ai.defineFlow(
  {
    name: 'summarizeCorrelationFlow',
    inputSchema: SummarizeCorrelationInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    if (input.correlation === null) {
        return "No summary can be generated as there was not enough data to calculate a correlation.";
    }
    const {output} = await prompt(input);
    return output!;
  }
);
