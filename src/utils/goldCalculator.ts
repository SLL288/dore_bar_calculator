export type DensityKaratRow = {
  densityMin: number
  densityMax: number
  karat: number
  chartSection: string
}

export type CalculatorInputs = {
  goldWeightGrams: number
  weightDifference: number
  goldSpotPricePerOz: number
  handlingFeePerGram: number
}

export type CalculationResult = {
  density: number
  estimatedKarat: number
  spotPricePerGram24k: number
  goldPurityRatio: number
  grossPricePerGram: number
  netUnitPricePerGram: number
  finalTotalPrice: number
  karatMethod: string
}

export const TROY_OUNCE_GRAMS = 31.1035

// Editable traditional field-chart reference table. Update these rows as better
// assay-backed or site-specific density-to-karat references become available.
export const densityKaratTable: DensityKaratRow[] = [
  { densityMin: 19.3, densityMax: 19.3, karat: 24, chartSection: '24/23 carats' },
  { densityMin: 19.2, densityMax: 19.2, karat: 23.75, chartSection: '24/23 carats' },
  { densityMin: 19.1, densityMax: 19.1, karat: 23.6, chartSection: '24/23 carats' },
  { densityMin: 18.97, densityMax: 19, karat: 23.4, chartSection: '24/23 carats' },
  { densityMin: 18.91, densityMax: 18.96, karat: 23.3, chartSection: '24/23 carats' },
  { densityMin: 18.84, densityMax: 18.9, karat: 23.2, chartSection: '24/23 carats' },
  { densityMin: 18.78, densityMax: 18.83, karat: 23.1, chartSection: '24/23 carats' },
  { densityMin: 18.72, densityMax: 18.77, karat: 23, chartSection: '24/23 carats' },
  { densityMin: 18.65, densityMax: 18.71, karat: 22.9, chartSection: '22 carats' },
  { densityMin: 18.59, densityMax: 18.64, karat: 22.8, chartSection: '22 carats' },
  { densityMin: 18.53, densityMax: 18.58, karat: 22.7, chartSection: '22 carats' },
  { densityMin: 18.47, densityMax: 18.52, karat: 22.6, chartSection: '22 carats' },
  { densityMin: 18.41, densityMax: 18.46, karat: 22.5, chartSection: '22 carats' },
  { densityMin: 18.34, densityMax: 18.4, karat: 22.4, chartSection: '22 carats' },
  { densityMin: 18.28, densityMax: 18.33, karat: 22.3, chartSection: '22 carats' },
  { densityMin: 18.22, densityMax: 18.27, karat: 22.2, chartSection: '22 carats' },
  { densityMin: 18.16, densityMax: 18.21, karat: 22.1, chartSection: '22 carats' },
  { densityMin: 18.1, densityMax: 18.15, karat: 22, chartSection: '22 carats' },
  { densityMin: 18.05, densityMax: 18.09, karat: 21.9, chartSection: '21 carats' },
  { densityMin: 17.99, densityMax: 18.04, karat: 21.8, chartSection: '21 carats' },
  { densityMin: 17.93, densityMax: 17.98, karat: 21.7, chartSection: '21 carats' },
  { densityMin: 17.87, densityMax: 17.92, karat: 21.6, chartSection: '21 carats' },
  { densityMin: 17.81, densityMax: 17.86, karat: 21.5, chartSection: '21 carats' },
  { densityMin: 17.75, densityMax: 17.8, karat: 21.4, chartSection: '21 carats' },
  { densityMin: 17.7, densityMax: 17.74, karat: 21.3, chartSection: '21 carats' },
  { densityMin: 17.64, densityMax: 17.69, karat: 21.2, chartSection: '21 carats' },
  { densityMin: 17.59, densityMax: 17.63, karat: 21.1, chartSection: '21 carats' },
  { densityMin: 17.53, densityMax: 17.58, karat: 21, chartSection: '21 carats' },
  { densityMin: 17.47, densityMax: 17.52, karat: 20.9, chartSection: '20 carats' },
  { densityMin: 17.42, densityMax: 17.46, karat: 20.8, chartSection: '20 carats' },
  { densityMin: 17.37, densityMax: 17.41, karat: 20.7, chartSection: '20 carats' },
  { densityMin: 17.31, densityMax: 17.36, karat: 20.6, chartSection: '20 carats' },
  { densityMin: 17.26, densityMax: 17.3, karat: 20.5, chartSection: '20 carats' },
  { densityMin: 17.21, densityMax: 17.25, karat: 20.4, chartSection: '20 carats' },
  { densityMin: 17.15, densityMax: 17.2, karat: 20.3, chartSection: '20 carats' },
  { densityMin: 17.1, densityMax: 17.14, karat: 20.2, chartSection: '20 carats' },
  { densityMin: 17.04, densityMax: 17.09, karat: 20.1, chartSection: '20 carats' },
  { densityMin: 16.98, densityMax: 17.03, karat: 20, chartSection: '20 carats' },
  { densityMin: 16.94, densityMax: 16.98, karat: 19.9, chartSection: '19 carats' },
  { densityMin: 16.89, densityMax: 16.93, karat: 19.8, chartSection: '19 carats' },
  { densityMin: 16.84, densityMax: 16.88, karat: 19.7, chartSection: '19 carats' },
  { densityMin: 16.79, densityMax: 16.83, karat: 19.6, chartSection: '19 carats' },
  { densityMin: 16.73, densityMax: 16.78, karat: 19.5, chartSection: '19 carats' },
  { densityMin: 16.68, densityMax: 16.72, karat: 19.4, chartSection: '19 carats' },
  { densityMin: 16.63, densityMax: 16.67, karat: 19.3, chartSection: '19 carats' },
  { densityMin: 16.58, densityMax: 16.62, karat: 19.2, chartSection: '19 carats' },
  { densityMin: 16.53, densityMax: 16.57, karat: 19.1, chartSection: '19 carats' },
  { densityMin: 16.49, densityMax: 16.52, karat: 19, chartSection: '19 carats' },
  { densityMin: 16.44, densityMax: 16.48, karat: 18.9, chartSection: '18 carats' },
  { densityMin: 16.39, densityMax: 16.43, karat: 18.8, chartSection: '18 carats' },
  { densityMin: 16.34, densityMax: 16.38, karat: 18.7, chartSection: '18 carats' },
  { densityMin: 16.29, densityMax: 16.33, karat: 18.6, chartSection: '18 carats' },
  { densityMin: 16.24, densityMax: 16.28, karat: 18.5, chartSection: '18 carats' },
  { densityMin: 16.2, densityMax: 16.23, karat: 18.4, chartSection: '18 carats' },
  { densityMin: 16.15, densityMax: 16.19, karat: 18.3, chartSection: '18 carats' },
  { densityMin: 16.1, densityMax: 16.14, karat: 18.2, chartSection: '18 carats' },
  { densityMin: 16.05, densityMax: 16.09, karat: 18.1, chartSection: '18 carats' },
  { densityMin: 16.01, densityMax: 16.04, karat: 18, chartSection: '18 carats' },
  { densityMin: 15.96, densityMax: 16, karat: 17.9, chartSection: '17 carats' },
  { densityMin: 15.92, densityMax: 15.95, karat: 17.8, chartSection: '17 carats' },
  { densityMin: 15.87, densityMax: 15.91, karat: 17.7, chartSection: '17 carats' },
  { densityMin: 15.82, densityMax: 15.86, karat: 17.6, chartSection: '17 carats' },
  { densityMin: 15.78, densityMax: 15.81, karat: 17.5, chartSection: '17 carats' },
  { densityMin: 15.73, densityMax: 15.77, karat: 17.4, chartSection: '17 carats' },
  { densityMin: 15.69, densityMax: 15.72, karat: 17.3, chartSection: '17 carats' },
  { densityMin: 15.65, densityMax: 15.68, karat: 17.2, chartSection: '17 carats' },
  { densityMin: 15.6, densityMax: 15.64, karat: 17.1, chartSection: '17 carats' },
  { densityMin: 15.56, densityMax: 15.59, karat: 17, chartSection: '17 carats' },
]

export function estimateKaratFromDensity(density: number): { karat: number; method: string } {
  const directMatch = densityKaratTable.find(
    (row) => density >= row.densityMin && density <= row.densityMax,
  )

  if (directMatch) {
    return {
      karat: directMatch.karat,
      method: `Matched ${directMatch.chartSection} density range ${directMatch.densityMin.toFixed(2)}-${directMatch.densityMax.toFixed(2)} g/cm3.`,
    }
  }

  const sortedByMidpoint = [...densityKaratTable].sort((a, b) => {
    const midpointA = (a.densityMin + a.densityMax) / 2
    const midpointB = (b.densityMin + b.densityMax) / 2
    return Math.abs(density - midpointA) - Math.abs(density - midpointB)
  })

  const closest = sortedByMidpoint[0]
  return {
    karat: closest.karat,
    method: `Closest-match estimate using nearest table range ${closest.densityMin.toFixed(2)}-${closest.densityMax.toFixed(2)} g/cm3.`,
  }
}

export function calculateGoldBarValue(inputs: CalculatorInputs): CalculationResult {
  const density = inputs.goldWeightGrams / inputs.weightDifference
  const { karat, method } = estimateKaratFromDensity(density)
  const spotPricePerGram24k = inputs.goldSpotPricePerOz / TROY_OUNCE_GRAMS
  const goldPurityRatio = karat / 24
  const grossPricePerGram = spotPricePerGram24k * goldPurityRatio
  const netUnitPricePerGram = Math.max(0, grossPricePerGram - inputs.handlingFeePerGram)
  const finalTotalPrice = netUnitPricePerGram * inputs.goldWeightGrams

  return {
    density,
    estimatedKarat: karat,
    spotPricePerGram24k,
    goldPurityRatio,
    grossPricePerGram,
    netUnitPricePerGram,
    finalTotalPrice,
    karatMethod: method,
  }
}

export type GoldApiSpotResponse = {
  price?: number
  updatedAt?: string
  updatedAtReadable?: string
}

export async function fetchGoldApiSpotPrice(): Promise<{
  price: number
  updatedAt?: string
}> {
  // gold-api.com returns the current XAU/USD troy-ounce spot quote without an
  // API key. A backend proxy can still be added later for caching and audit logs.
  const response = await fetch('https://api.gold-api.com/price/XAU/USD')

  if (!response.ok) {
    throw new Error(`GoldAPI.io request failed with status ${response.status}`)
  }

  const data = (await response.json()) as GoldApiSpotResponse
  if (!data.price || !Number.isFinite(data.price) || data.price <= 0) {
    throw new Error('GoldAPI.io response did not include a valid price.')
  }

  return {
    price: data.price,
    updatedAt: data.updatedAt,
  }
}
