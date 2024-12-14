export function calculateTax(grossSalary: number, pensionContribution: number) {
  const taxableIncome = grossSalary - pensionContribution;

  let incomeTax = 0;
  let ni = 0;

  // Income Tax calculation
  if (taxableIncome > 125140) {
    incomeTax += (taxableIncome - 125140) * 0.45;
    incomeTax += (125140 - 100000) * 0.6;
    incomeTax += (100000 - 50270) * 0.4;
    incomeTax += (50270 - 12570) * 0.2;
  } else if (taxableIncome > 100000) {
    incomeTax += (taxableIncome - 100000) * 0.6;
    incomeTax += (100000 - 50270) * 0.4;
    incomeTax += (50270 - 12570) * 0.2;
  } else if (taxableIncome > 50270) {
    incomeTax += (taxableIncome - 50270) * 0.4;
    incomeTax += (50270 - 12570) * 0.2;
  } else if (taxableIncome > 12570) {
    incomeTax += (taxableIncome - 12570) * 0.2;
  }

  // National Insurance calculation
  if (taxableIncome > 50270) {
    ni += (taxableIncome - 50270) * 0.02;
    ni += (50270 - 12570) * 0.08;
  } else if (taxableIncome > 12570) {
    ni += (taxableIncome - 12570) * 0.08;
  }

  const totalTax = incomeTax + ni;
  const netTakeHome = taxableIncome - totalTax;

  return {
    taxableIncome,
    incomeTax,
    ni,
    totalTax,
    netTakeHome,
  };
}

export function generateChartData(grossSalary: number) {
  const data = [];
  const maxContribution = Math.min(grossSalary, 60000);
  for (let pension = 0; pension <= maxContribution; pension += 1000) {
    const { netTakeHome, totalTax } = calculateTax(grossSalary, pension);
    data.push({
      pension: pension.toString(),
      takeHome: netTakeHome,
      tax: totalTax,
      pensionContribution: pension,
    });
  }
  return data;
}

