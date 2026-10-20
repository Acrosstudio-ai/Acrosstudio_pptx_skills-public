function amount(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative whole-yen amount within the safe numeric range`)
  }
  return value
}

function period(years) {
  if (!Number.isSafeInteger(years) || years <= 0)
    throw new Error('years must be a positive whole number of years')
  return years
}

function total(items, name) {
  if (!Array.isArray(items))
    throw new Error(`${name} must explicitly list costs; use [] only when none are confirmed`)
  return amount(
    items.reduce((sum, item) => {
      if (typeof item.name !== 'string' || !item.name.trim())
        throw new Error(`${name} item needs a name`)
      return sum + amount(item.amount, item.name)
    }, 0),
    name
  )
}

export function calculateCosts({ oneTimeCosts, monthlyCosts, years }) {
  period(years)
  const initialInvestment = total(oneTimeCosts, 'oneTimeCosts')
  const monthlyOperatingCost = total(monthlyCosts, 'monthlyCosts')
  const annualOperatingCost = amount(monthlyOperatingCost * 12, 'annualOperatingCost')
  const totalCost = amount(initialInvestment + annualOperatingCost * years, 'totalCost')
  return { initialInvestment, monthlyOperatingCost, annualOperatingCost, totalCost, years }
}

export function calculateRoi({ initialInvestment, annualOperatingCost, annualBenefit, years }) {
  amount(initialInvestment, 'initialInvestment')
  amount(annualOperatingCost, 'annualOperatingCost')
  amount(annualBenefit, 'annualBenefit')
  period(years)
  const annualNetBenefit = annualBenefit - annualOperatingCost
  const cumulativeNetBenefit = annualNetBenefit * years
  const netProfit = cumulativeNetBenefit - initialInvestment
  const totalCost = initialInvestment + annualOperatingCost * years
  const roiPercent = initialInvestment === 0 ? null : (netProfit / initialInvestment) * 100
  const paybackYears = annualNetBenefit <= 0 ? null : initialInvestment / annualNetBenefit
  for (const value of [
    annualNetBenefit,
    cumulativeNetBenefit,
    netProfit,
    totalCost,
    roiPercent,
    paybackYears
  ]) {
    if (value !== null && (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER)) {
      throw new Error('Financial result exceeds the safe numeric range')
    }
  }
  return {
    annualNetBenefit,
    cumulativeNetBenefit,
    netProfit,
    totalCost,
    roiPercent,
    paybackYears,
    years
  }
}
