import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UK Pension Calculator | Salary Sacrifice Tax Savings Calculator",
  description:
    "Calculate your tax savings through salary sacrifice pension contributions. See how much you save in Income Tax and National Insurance, plus understand future withdrawal scenarios.",
  keywords:
    "UK pension, salary sacrifice, pension calculator, tax savings, retirement planning, National Insurance savings, income tax relief",
  openGraph: {
    title: "UK Pension Calculator | Salary Sacrifice Tax Savings Calculator",
    description:
      "Calculate your tax savings through salary sacrifice pension contributions. See how much you save in Income Tax and National Insurance, plus understand future withdrawal scenarios.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
