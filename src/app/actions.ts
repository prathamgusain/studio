'use server';
import { summarizeCorrelation, type SummarizeCorrelationInput } from '@/ai/flows/summarize-correlation';

export type PredictClimateDataInput = {
    dataType: string;
    data: { year: string; value: number | null }[];
};

export type PredictClimateDataOutput = {
    year: string;
    value: number;
}[];

/**
 * Performs a linear regression on the given data.
 * @param data An array of objects with year and value.
 * @returns An object with the slope and intercept of the regression line.
 */
function calculateLinearRegression(data: { year: number; value: number }[]) {
    const n = data.length;
    if (n < 2) {
        // Not enough data points to create a meaningful regression.
        return { slope: 0, intercept: data[0]?.value || 0 };
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (const point of data) {
        sumX += point.year;
        sumY += point.value;
        sumXY += point.year * point.value;
        sumXX += point.year * point.year;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}


export async function getPrediction(input: PredictClimateDataInput): Promise<PredictClimateDataOutput> {
    const validData = input.data
        .filter(d => d.value !== null && d.value !== undefined)
        .map(d => ({ year: parseInt(d.year, 10), value: d.value as number }));

    if (validData.length < 2) {
        // Cannot predict with less than 2 data points.
        return [];
    }
    
    const { slope, intercept } = calculateLinearRegression(validData);

    const lastYear = Math.max(...validData.map(d => d.year));
    const startYear = lastYear + 1;
    const endYear = 2040;

    const predictions: PredictClimateDataOutput = [];

    for (let year = startYear; year <= endYear; year++) {
        const predictedValue = slope * year + intercept;
        predictions.push({
            year: year.toString(),
            value: predictedValue,
        });
    }

    return predictions;
}

export type CorrelationInput = {
    dataset1: { year: string; value: number | null }[];
    dataset2: { year: string; value: number | null }[];
};

export type CorrelationOutput = {
    correlation: number | null;
    interpretation: string;
    pairedData: { x: number; y: number }[];
};

function calculatePearsonCorrelation(data: { x: number; y: number }[]): number | null {
    const n = data.length;
    if (n < 2) {
        return null; // Not enough data
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (const point of data) {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x * point.x;
        sumY2 += point.y * point.y;
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) {
        return 0; // No variation
    }

    return numerator / denominator;
}

function getCorrelationInterpretation(r: number): string {
    const absR = Math.abs(r);
    if (absR >= 0.8) return 'Very Strong';
    if (absR >= 0.6) return 'Strong';
    if (absR >= 0.4) return 'Moderate';
    if (absR >= 0.2) return 'Weak';
    return 'Very Weak or No';
}

export async function getCorrelation(input: CorrelationInput): Promise<CorrelationOutput> {
    const dataMap1 = new Map(input.dataset1.map(d => [d.year, d.value]));
    
    const pairedData: { x: number; y: number }[] = [];

    for (const d2 of input.dataset2) {
        if (d2.value !== null && dataMap1.has(d2.year)) {
            const val1 = dataMap1.get(d2.year);
            if (val1 !== null && val1 !== undefined) {
                pairedData.push({ x: val1, y: d2.value });
            }
        }
    }

    if (pairedData.length < 2) {
        return { correlation: null, interpretation: 'Not enough overlapping data points to calculate correlation.', pairedData: [] };
    }

    const correlation = calculatePearsonCorrelation(pairedData);

    if (correlation === null) {
        return { correlation: null, interpretation: 'Could not calculate correlation.', pairedData };
    }

    const direction = correlation > 0 ? 'positive' : correlation < 0 ? 'negative' : 'neutral';
    const strength = getCorrelationInterpretation(correlation);
    const result = (strength === 'Very Weak or No') 
        ? `There is a ${strength} correlation between the two datasets.`
        : `There is a ${strength} ${direction} correlation between the two datasets.`

    return {
        correlation,
        interpretation: result,
        pairedData
    };
}


export async function getCorrelationSummary(input: SummarizeCorrelationInput): Promise<string> {
    try {
        const summary = await summarizeCorrelation(input);
        return summary;
    } catch (error) {
        console.error("AI summary failed:", error);
        return "Could not generate an AI-powered summary at this time.";
    }
}
