import * as React from "react";
import { Input } from "@/components/ui/input";

interface CombinedInputProps {
  value: number;
  onChange: (value: number) => void;
  total: number;
  maxValue: number;
}

export function CombinedInput({
  value,
  onChange,
  total,
  maxValue,
}: CombinedInputProps) {
  const [internalValue, setInternalValue] = React.useState(value.toString());
  const [internalPercentage, setInternalPercentage] = React.useState(
    ((value / total) * 100).toFixed(1)
  );

  //   React.useEffect(() => {
  //     setInternalValue(value);
  //     setInternalPercentage(((value / total) * 100).toFixed(1));
  //   }, [value, total]);

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = Number(e.target.value);

    const newamount = Math.round(total * (newPercentage / 100));
    if (newamount <= maxValue) {
      setInternalPercentage(e.target.value);
      setInternalValue(newamount.toString());
      onChange(newamount);
    } else {
      setInternalPercentage(((maxValue / total) * 100).toFixed(1));
      setInternalValue(maxValue.toString());
      onChange(maxValue);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInternalValue(inputValue);

    const newValue = Number(inputValue) || 0;
    if (newValue <= maxValue) {
      setInternalPercentage(((newValue / total) * 100).toFixed(1));
      setInternalValue(e.target.value);
      onChange(newValue);
    } else {
      setInternalPercentage(((maxValue / total) * 100).toFixed(1));
      setInternalValue(maxValue.toString());
      onChange(maxValue);
    }
  };

  return (
    <div className="flex gap-4 w-full flex-col items-start md:flex-row md:items-center">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={internalPercentage}
          className="w-full max-w-[200px]"
          onChange={handlePercentageChange}
        />
        <span className="text-sm font-medium">%</span>
      </div>
      <p className="text-sm text-muted-foreground">or</p>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">£</span>
        <Input
          type="number"
          value={internalValue}
          className="w-full max-w-[200px]"
          onChange={handleAmountChange}
        />
      </div>
    </div>
  );
}
