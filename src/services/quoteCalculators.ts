/**
 * Business Logic Engines for DigitalSaurien
 * Factorized calculation logic for transparency and maintainability.
 */

// ─── Delivery Quote ───────────────────────────────────────────────────────────

export interface DeliveryQuoteInput {
  distance: number;              // km
  duration: number;              // heures
  fuelConsumption: number;       // L/100km
  fuelPrice: number;             // €/L
  vehicleKm: number;             // kilométrage actuel du véhicule
  hourlyRate: number;            // taux horaire principal (non utilisé ici)
  travelHourlyRate: number;      // taux horaire déplacement €/h
  travelTimeCoeff: number;       // coefficient facturation temps trajet (défaut 0.5)
  tolls: number;                 // péages €
  animalCount: number;
  isHardship: boolean;           // nuit/WE/férié
  hardshipRate: number;          // taux majoration % (défaut 10%)
  minForfait: number;            // montant minimum
  baseCostPerKm: number;         // coût de base véhicule €/km (défaut 0.15)
}

export interface DeliveryQuoteResult {
  fuelCost: number;
  vehicleCost: number;           // anciennement wearCost
  vehicleRatePerKm: number;      // tarif final au km
  timeCost: number;
  hardshipCost: number;
  tollsCost: number;
  subtotal: number;
  total: number;
  vehicleKmAlert: boolean;       // alerte si tarif > seuil
  breakdown: { label: string; amount: number }[];
}

/**
 * Calcule la majoration kilométrique selon les paliers définis.
 * La majoration est toujours faible : max 0.04 €/km.
 */
function getVehicleKmSurcharge(vehicleKm: number): number {
  if (vehicleKm <= 50000)  return 0.00;
  if (vehicleKm <= 100000) return 0.01;
  if (vehicleKm <= 150000) return 0.02;
  if (vehicleKm <= 200000) return 0.03;
  return 0.04;
}

export const calculateDeliveryQuote = (input: DeliveryQuoteInput): DeliveryQuoteResult => {
  const baseCostPerKm = input.baseCostPerKm ?? 0.15;
  const travelTimeCoeff = input.travelTimeCoeff ?? 0.5;
  const hardshipRate = input.hardshipRate ?? 10;
  const travelHourlyRate = input.travelHourlyRate ?? 35;

  // 1. Carburant
  const fuelCost = (input.distance / 100) * input.fuelConsumption * input.fuelPrice;

  // 2. Frais véhicule (participation)
  //    tarif = base + majoration selon km (max 0.04 €/km supplémentaire)
  const kmSurcharge = getVehicleKmSurcharge(input.vehicleKm ?? 0);
  const vehicleRatePerKm = baseCostPerKm + kmSurcharge;
  const vehicleCost = input.distance * vehicleRatePerKm;

  // 3. Temps de trajet avec coefficient (50% par défaut)
  const timeCost = input.duration * travelHourlyRate * travelTimeCoeff;

  // 4. Majoration nuit/WE/férié — sur le temps de trajet uniquement, en %
  const hardshipCost = input.isHardship ? timeCost * (hardshipRate / 100) : 0;

  // 5. Péages
  const tollsCost = input.tolls ?? 0;

  // 6. Total
  const rawSubtotal = fuelCost + vehicleCost + timeCost + hardshipCost + tollsCost;
  const total = Math.max(rawSubtotal, input.minForfait ?? 0);

  // 7. Alerte si tarif dépasse 0.30 €/km
  const vehicleKmAlert = vehicleRatePerKm > 0.30;

  // Filtre les lignes à 0 pour un récap épuré
  const breakdown: { label: string; amount: number }[] = [
    { label: "Carburant", amount: fuelCost },
    { label: "Participation véhicule", amount: vehicleCost },
    { label: `Temps de trajet (${travelTimeCoeff * 100}% × ${travelHourlyRate}€/h)`, amount: timeCost },
    ...(hardshipCost > 0 ? [{ label: `Majoration nuit/WE/férié (+${hardshipRate}%)`, amount: hardshipCost }] : []),
    ...(tollsCost > 0 ? [{ label: "Péages", amount: tollsCost }] : []),
  ];

  return {
    fuelCost,
    vehicleCost,
    vehicleRatePerKm,
    timeCost,
    hardshipCost,
    tollsCost,
    subtotal: rawSubtotal,
    total,
    vehicleKmAlert,
    breakdown,
  };
};

// ─── Automation Quote ─────────────────────────────────────────────────────────

export interface AutomationQuoteInput {
  baseHours: number;
  hourlyRate: number;
  complexityCoeff: number;
  toolCount: number;
  toolCoeff: number;
  iaCount: number;
  iaCoeff: number;
  accountsCreated: number;
  accountSetupFee: number;
  subscriptionsSetup: number;
  subscriptionFee: number;
  hasMaintenance: boolean;
  maintenanceFee: number;
  hasDatabase: boolean;
  dbFee: number;
  discountPercent: number;
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
  const toolsAdjustment = Math.max(0, (input.toolCount - 1)) * (input.toolCoeff - 1);
  const iaAdjustment = input.iaCount * (input.iaCoeff - 1);
  const totalCoeff = input.complexityCoeff + toolsAdjustment + iaAdjustment;

  const adjustedHours = input.baseHours * totalCoeff;
  const baseCost = adjustedHours * input.hourlyRate;

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
    iaSurcharge: 0,
    setupFees,
    maintenanceFees,
    subtotal,
    discountAmount,
    total,
    breakdown: [
      { label: `Prestation (${adjustedHours.toFixed(1)}h ajustées)`, amount: baseCost },
      { label: "Frais de configuration & Comptes", amount: setupFees },
      { label: "Maintenance initiale", amount: maintenanceFees },
      { label: "Remise appliquée", amount: -discountAmount },
    ],
  };
};
