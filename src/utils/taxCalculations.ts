export interface TaxBand {
  name: string;
  amount: number;
  rate: number;
  taxPaid: number;
}

export function calculateIncomeTaxBands(taxableIncome: number): TaxBand[] {
  const incomeTaxBands: TaxBand[] = [
    { name: "Personal Allowance", rate: 0, amount: 0, taxPaid: 0 },
    { name: "Basic Rate", rate: 20, amount: 0, taxPaid: 0 },
    { name: "Higher Rate", rate: 40, amount: 0, taxPaid: 0 },
    { name: "Personal Allowance Taper", rate: 60, amount: 0, taxPaid: 0 },
    { name: "Additional Rate", rate: 45, amount: 0, taxPaid: 0 },
  ];

  // Calculate amounts in each band
  if (taxableIncome > 125140) {
    incomeTaxBands[4].amount = taxableIncome - 125140;
    incomeTaxBands[3].amount = 25140; // 125140 - 100000
    incomeTaxBands[2].amount = 49730; // 100000 - 50270
    incomeTaxBands[1].amount = 37700; // 50270 - 12570
    incomeTaxBands[0].amount = 0; // No personal allowance
  } else if (taxableIncome > 100000) {
    incomeTaxBands[3].amount = taxableIncome - 100000;
    incomeTaxBands[2].amount = 49730; // 100000 - 50270
    incomeTaxBands[1].amount = 37700; // 50270 - 12570
    incomeTaxBands[0].amount = Math.max(0, 12570 - (taxableIncome - 100000) / 2);
  } else if (taxableIncome > 50270) {
    incomeTaxBands[2].amount = taxableIncome - 50270;
    incomeTaxBands[1].amount = 37700; // 50270 - 12570
    incomeTaxBands[0].amount = 12570;
  } else if (taxableIncome > 12570) {
    incomeTaxBands[1].amount = taxableIncome - 12570;
    incomeTaxBands[0].amount = 12570;
  } else {
    incomeTaxBands[0].amount = taxableIncome;
  }

  // Calculate tax paid for each band
  incomeTaxBands.forEach(band => {
    band.taxPaid = band.amount * (band.rate / 100);
  });

  return incomeTaxBands;
}

export function calculateNIBands(taxableIncome: number): TaxBand[] {
  const niBands: TaxBand[] = [
    { name: "Standard Rate", rate: 8, amount: 0, taxPaid: 0 },
    { name: "Higher Rate", rate: 2, amount: 0, taxPaid: 0 },
  ];

  if (taxableIncome > 50270) {
    niBands[1].amount = taxableIncome - 50270;
    niBands[0].amount = 37700; // 50270 - 12570
  } else if (taxableIncome > 12570) {
    niBands[0].amount = taxableIncome - 12570;
  }

  // Calculate NI tax paid for each band
  niBands.forEach(band => {
    band.taxPaid = band.amount * (band.rate / 100);
  });

  return niBands;
}

export function calculateTax(grossSalary: number, pensionContribution: number) {
  const taxableIncome = grossSalary - pensionContribution;
  const incomeTaxBands = calculateIncomeTaxBands(taxableIncome);
  const niBands = calculateNIBands(taxableIncome);

  const incomeTax = incomeTaxBands.reduce((total, band) => total + band.taxPaid, 0);
  const ni = niBands.reduce((total, band) => total + band.taxPaid, 0);
  const totalTax = incomeTax + ni;
  const netTakeHome = taxableIncome - totalTax;

  return {
    taxableIncome,
    incomeTaxBands,
    niBands,
    incomeTax,
    ni,
    totalTax,
    netTakeHome,
  };
}

export function calculatePensionWithdrawal(potValue: number, annualWithdrawal: number) {
  const TAX_FREE_POT_LIMIT = 1073100;
  
  // Calculate tax-free portion
  const taxFreePortion = potValue <= TAX_FREE_POT_LIMIT ? 0.25 : (TAX_FREE_POT_LIMIT * 0.25) / potValue;
  const taxFreeAmount = annualWithdrawal * taxFreePortion;
  const taxableAmount = annualWithdrawal - taxFreeAmount;

  // Calculate income tax on the taxable portion
  const incomeTaxBands = calculateIncomeTaxBands(taxableAmount);
  const incomeTax = incomeTaxBands.reduce((total, band) => total + band.taxPaid, 0);
  const totalTax = incomeTax; // No NI on pension withdrawals
  const netWithdrawal = annualWithdrawal - totalTax;

  return {
    taxFreePortion,
    taxFreeAmount,
    taxableAmount,
    incomeTaxBands,
    incomeTax,
    totalTax,
    netWithdrawal,
  };
}

export function calculateMarginalRelief(grossSalary: number, pensionContribution: number) {
  // Calculate tax with current contribution
  const current = calculateTax(grossSalary, pensionContribution);
  
  // Calculate tax with £1 more contribution
  const withExtra = calculateTax(grossSalary, pensionContribution + 1);
  
  // The marginal relief is how much less you pay in tax for that £1
  const taxDifference = current.totalTax - withExtra.totalTax;
  
  // Return as a percentage (e.g., 0.4 for 40% relief)
  return taxDifference;
}

export function generateChartData(grossSalary: number, pensionContribution: number) {
  const data = [];
  const maxContribution = Math.min(grossSalary, 60000);
  const step = 1000;

  // Generate points from 0 to maxContribution
  for (let pension = 0; pension <= maxContribution; pension += step) {
    const { netTakeHome, totalTax } = calculateTax(grossSalary, pension);
    const marginalRelief = calculateMarginalRelief(grossSalary, pension);
    data.push({
      pension,
      takeHome: netTakeHome,
      tax: totalTax,
      pensionContribution: pension,
      marginalRelief: Math.round(marginalRelief * 100), // Convert to percentage
    });
  }

  // Add gross salary point if it's not already included and is less than maxContribution
  if (grossSalary <= maxContribution && grossSalary % step !== 0) {
    const { netTakeHome, totalTax } = calculateTax(grossSalary, grossSalary);
    const marginalRelief = calculateMarginalRelief(grossSalary, grossSalary);
    const newPoint = {
      pension: grossSalary,
      takeHome: netTakeHome,
      tax: totalTax,
      pensionContribution: grossSalary,
      marginalRelief: Math.round(marginalRelief * 100),
    };
    
    // Find the correct position to insert the point
    const insertIndex = data.findIndex(point => point.pension > grossSalary);
    if (insertIndex === -1) {
      data.push(newPoint);
    } else {
      data.splice(insertIndex, 0, newPoint);
    }
  }

  // Add the current pension contribution point if it's not already included
  if (pensionContribution > 0 && pensionContribution <= maxContribution) {
    if (!data.some(point => point.pension === pensionContribution)) {
      const { netTakeHome, totalTax } = calculateTax(grossSalary, pensionContribution);
      const marginalRelief = calculateMarginalRelief(grossSalary, pensionContribution);
      const newPoint = {
        pension: pensionContribution,
        takeHome: netTakeHome,
        tax: totalTax,
        pensionContribution,
        marginalRelief: Math.round(marginalRelief * 100),
      };
      
      // Find the correct position to insert the point
      const insertIndex = data.findIndex(point => point.pension > pensionContribution);
      if (insertIndex === -1) {
        data.push(newPoint);
      } else {
        data.splice(insertIndex, 0, newPoint);
      }
    }
  }

  return data;
}

