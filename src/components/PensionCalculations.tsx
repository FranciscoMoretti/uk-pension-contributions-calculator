import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateMarginalCombinedRelief,
  calculatePensionWithdrawal,
  generateChartData as generateValuesPerContributionData,
  generateWithdrawalChartData,
} from "@/utils/taxCalculations";
import { SalaryBreakdownChart } from "@/components/SalaryBreakdownChart";
import { TaxComparisonChart } from "@/components/TaxComparisonChart";
import { TaxBreakdown } from "@/components/TaxBreakdown";
import { WithdrawalBreakdown } from "@/components/WithdrawalBreakdown";
import { WithdrawalChart } from "@/components/WithdrawalChart";
import { MarginalROIChart } from "@/components/MarginalROIChart";
import { useDeferredValue } from "react";

export function PensionCalculations(props: {
  grossSalary: number;
  pensionContribution: number;
  potValue: number;
  annualPensionWithdrawal: number;
}) {
  const grossSalary = useDeferredValue(props.grossSalary);
  const pensionContribution = useDeferredValue(props.pensionContribution);
  const potValue = useDeferredValue(props.potValue);
  const annualPensionWithdrawal = useDeferredValue(
    props.annualPensionWithdrawal
  );

  const withdrawalChartData = generateWithdrawalChartData(
    potValue,
    annualPensionWithdrawal
  );
  const { withdrawalTaxRate } = calculatePensionWithdrawal(
    potValue,
    annualPensionWithdrawal
  );

  const valuesByContrutributionData = generateValuesPerContributionData(
    grossSalary,
    pensionContribution
  ).map((item) => ({
    ...item,
    taxSalaryPercentage: Number((item.taxSalaryRate * 100).toFixed(1)),
    taxPensionPercentage: Number((withdrawalTaxRate * 100).toFixed(1)),
    combinedTaxPercentage: Number(
      ((withdrawalTaxRate + item.taxSalaryRate) * 100).toFixed(1)
    ),
    pensionAfterWithdrawal: item.pension * (1 - withdrawalTaxRate),
    marginalReliefPercentage: Number(
      (item.marginalReliefRate * 100).toFixed(1)
    ),
    marginalCombinedReliefRate: calculateMarginalCombinedRelief(
      item.marginalReliefRate,
      withdrawalTaxRate
    ),
    marginalCombinedReliefPercentage: Number(
      (
        calculateMarginalCombinedRelief(
          item.marginalReliefRate,
          withdrawalTaxRate
        ) * 100
      ).toFixed(1)
    ),
    pensionWithdrawalTax: item.pension * withdrawalTaxRate,
    net: item.takeHome + item.pension * (1 - withdrawalTaxRate),
    baselineReturn: 100,
    pensionBoost:
      Math.round(
        (1 /
          (1 -
            calculateMarginalCombinedRelief(
              item.marginalReliefRate,
              withdrawalTaxRate
            ))) *
          1000
      ) / 10,
  }));

  return (
    <>
      {/* Tax Breakdowns Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Salary Tax Breakdown</CardTitle>
            <CardDescription>Breakdown of your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <TaxBreakdown
              grossSalary={grossSalary}
              pensionContribution={pensionContribution}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Tax Breakdown</CardTitle>
            <CardDescription>
              Analysis of taxes on pension withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WithdrawalBreakdown
              potValue={potValue}
              annualWithdrawal={annualPensionWithdrawal}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 mb-8">
        <SalaryBreakdownChart
          data={valuesByContrutributionData}
          currentPension={pensionContribution}
        />
        <MarginalROIChart
          data={valuesByContrutributionData}
          currentPension={pensionContribution}
        />
        <TaxComparisonChart
          data={valuesByContrutributionData}
          currentPension={pensionContribution}
        />
      </div>

      <WithdrawalChart
        data={withdrawalChartData}
        currentWithdrawal={annualPensionWithdrawal}
      />
    </>
  );
}
