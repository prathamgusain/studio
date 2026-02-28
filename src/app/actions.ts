'use server';

import { predictClimateData, type PredictClimateDataInput, type PredictClimateDataOutput } from '@/ai/flows/predict-climate-data';
import { generateFutureOutlook, type GenerateFutureOutlookInput, type GenerateFutureOutlookOutput } from '@/ai/flows/generate-future-outlook';

export async function getPrediction(input: PredictClimateDataInput): Promise<PredictClimateDataOutput> {
    return predictClimateData(input);
}

export async function getFutureOutlook(input: GenerateFutureOutlookInput): Promise<GenerateFutureOutlookOutput> {
    return generateFutureOutlook(input);
}
