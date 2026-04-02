/**
 * Business Logic Engines for DigitalSaurien
 * Factorized calculation logic for transparency and maintainability.
 */

export interface DeliveryQuoteInput {
  distance: number;       // km
  duration: number;       // hours
  fuelConsumption: number; // L/100km
  fuelPrice: number;       // €/L
  wearCostPerKm: number;   // €/km
  hourlyRate: number;      // €/h
  tolls: number;           // €
  animalCount: number;
  isHardship: boolean;     // Pénibilité
  hardshipSurcharge: number; // Coeff (ex: 1.2)
  minForfait: number;      // Montant minimum
}

export interface DeliveryQuoteResult {
  fuelCost: number;
  wearCost: number;
  timeCost: number;
  hardshipCost: number;
  subtotal: number;
  total: number;
  breakdown: { label: string; amount: number }[];
}

export const calculateDeliveryQuote = (input: DeliveryQuoteInput): DeliveryQuoteResult => {
  const fuelCost = (input.distance / 100) * input.fuelConsumption * input.fuelPrice;
  const wearCost = input.distance * input.wearCostPerKm;
  
  let timeCost = input.duration * input.hourlyRate;
  let hardshipCost = input.isHardship ? timeCost * (input.hardshipSurcharge - 1) : 0;
  
  const rawSubtotal = fuelCost + wearCost + timeCost + hardshipCost + input.tolls;
  const subtotal = Math.max(rawSubtotal, input.minForfait);
  
  return {
    fuelCost,
    wearCost,
    timeCost,
    hardshipCost,
    subtotal,
    total: subtotal,
    breakdown: [
      { label: "Carburant", amount: fuelCost },
      { label: "Usure véhicule", amount: wearCost },
      { label: "Temps de trajet", amount: timeCost },
      { label: "Majoration pénibilité", amount: hardshipCost },
      { label: "Péages", amount: input.tolls },
    ]
  };
};

export interface AutomationQuoteInput {
  baseHours: number;
  hourlyRate: number;
  complexityCoeff: number;
  toolCount: number;
  toolCoeff: number;    // Ex: 1.1 per additional tool
  iaCount: number;
  iaCoeff: number;      // Ex: 1.2 per additional IA
  accountsCreated: number;
  accountSetupFee: number;
  subscriptionsSetup: number;
  subscriptionFee: number;
  hasMaintenance: boolean;
  maintenanceFee: number;
  hasDatabase: boolean;
  dbFee: number;
  discountPercent: number; // Remise (%)
}

export interface AutomationQuoteResult {
  adjustedHours: number;
  baseCost: number;
  toolsSurcharge: number;
  iaSurcharge: number;
  setupFees: number;
  maintenanceFees: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  breakdown: { label: string; amount: number }[];
}

export const calculateAutomationQuote = (input: AutomationQuoteInput): AutomationQuoteResult => {
  // 1. Time Adjustment
  // Logic: Each tool/IA adds a percentage of complexity to the base hours
  const toolsAdjustment = Math.max(0, (input.toolCount - 1)) * (input.toolCoeff - 1);
  const iaAdjustment = input.iaCount * (input.iaCoeff - 1);
  const totalCoeff = input.complexityCoeff + toolsAdjustment + iaAdjustment;
  
  const adjustedHours = input.baseHours * totalCoeff;
  const baseCost = adjustedHours * input.hourlyRate;
  
  // 2. Fixed Fees
  const setupFees = (input.accountsCreated * input.accountSetupFee) + 
                    (input.subscriptionsSetup * input.subscriptionFee) + 
                    (input.hasDatabase ? input.dbFee : 0);
  
  const maintenanceFees = input.hasMaintenance ? input.maintenanceFee : 0;
  
  const subtotal = baseCost + setupFees + maintenanceFees;
  const discountAmount = subtotal * (input.discountPercent / 100);
  const total = subtotal - discountAmount;
  
  return {
    adjustedHours,
    baseCost,
    toolsSurcharge: baseCost * (totalCoeff - input.complexityCoeff),
    iaSurcharge: 0, // already in toolsAdjustment/iaAdjustment if we want to separate, but here we merged in baseCost
    setupFees,
    maintenanceFees,
    subtotal,
    discountAmount,
    total,
    breakdown: [
      { label: `Prestation (Temps ajusté: ${adjustedHours.toFixed(1)}h)`, amount: baseCost },
      { label: "Frais de configuration & Comptes", amount: setupFees },
      { label: "Maintenance initiale", amount: maintenanceFees },
      { label: "Remise appliquée", amount: -discountAmount },
    ]
  };
};
