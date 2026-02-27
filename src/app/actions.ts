'use server';

import { predictClimateData, type PredictClimateDataInput, type PredictClimateDataOutput } from '@/ai/flows/predict-climate-data';

export async function getPrediction(input: PredictClimateDataInput): Promise<PredictClimateDataOutput> {
    return predictClimateData(input);
}
