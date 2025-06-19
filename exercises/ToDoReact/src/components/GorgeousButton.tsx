import React from "react";

//TWO OPTIONS OF FANCY BUTTONS => YELLOW AND RED, DEPENDING WHEN THEY ARE USED
type GorgeousButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: "amber" | "red" | "green" | "amber-400";
};

const baseStyles =
  "px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 hover:scale-105";

const variantStyles = {
  amber: "bg-amber-800 hover:bg-amber-700 border-amber-400 text-amber-100",
  red: "bg-red-800 hover:bg-red-700 border-red-400 text-red-100",
  green: "bg-green-800 hover:bg-green-700 border-green-400 text-green-100",
  "amber-400": "bg-amber-400 hover:bg-amber-300 border-amber-200 text-amber-800",
};

const GorgeousButton: React.FC<GorgeousButtonProps> = ({
  children,
  className = "",
  variant = "amber",
  ...props
}) => (
  <button
    className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default GorgeousButton;
