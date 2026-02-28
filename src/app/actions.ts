'use server';

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
