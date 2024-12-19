import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UK Pension Calculator | Optimize Your Pension Contributions",
  description:
    "Calculate the optimal pension contribution through salary sacrifice. See tax savings, withdrawal scenarios, and maximize your retirement savings with our interactive calculator.",
  keywords:
    "UK pension, salary sacrifice, pension calculator, tax savings, retirement planning",
  openGraph: {
    title: "UK Pension Calculator | Optimize Your Pension Contributions",
    description:
      "Calculate the optimal pension contribution through salary sacrifice. See tax savings, withdrawal scenarios, and maximize your retirement savings.",
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
