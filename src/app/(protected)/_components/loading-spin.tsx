import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface LoadingSpinProps {
  size?: "default" | "sm";
  className?: string;
}

const LoadingSpin = ({ size, className }: LoadingSpinProps) => {
  const loadingVariants = cva(
    "border-brand-purple mx-auto animate-spin rounded-full border-b-2",
    {
      variants: {
        size: {
          default: "h-12 w-12",
          sm: "h-6 w-6",
        },
      },
      defaultVariants: {
        size: "default",
      },
    },
  );

  return <div className={cn(loadingVariants({ size, className }))}></div>;
};

export default LoadingSpin;
