export interface TaxBand {
  name: string;
  amount: number;
  rate: number;
  taxPaid: number;
}

export function calculateTax(grossSalary: number, pensionContribution: number) {
  const taxableIncome = grossSalary - pensionContribution;

  // Income Tax bands calculation
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

  // NI bands calculation
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

export function generateChartData(grossSalary: number, pensionContribution: number) {
  const data = [];
  const maxContribution = Math.min(grossSalary, 60000);
  const step = 1000;

  // Generate points from 0 to maxContribution
  for (let pension = 0; pension <= maxContribution; pension += step) {
    const { netTakeHome, totalTax } = calculateTax(grossSalary, pension);
    data.push({
      pension,
      takeHome: netTakeHome,
      tax: totalTax,
      pensionContribution: pension,
    });
  }

  // Add gross salary point if it's not already included and is less than maxContribution
  if (grossSalary <= maxContribution && grossSalary % step !== 0) {
    const { netTakeHome, totalTax } = calculateTax(grossSalary, grossSalary);
    const newPoint = {
      pension: grossSalary,
      takeHome: netTakeHome,
      tax: totalTax,
      pensionContribution: grossSalary,
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
      const newPoint = {
        pension: pensionContribution,
        takeHome: netTakeHome,
        tax: totalTax,
        pensionContribution,
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

