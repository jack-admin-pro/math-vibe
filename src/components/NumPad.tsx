"use client";

import { Delete, Check } from "lucide-react";

interface NumPadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  maxLength?: number;
}

export function NumPad({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false,
  maxLength = 3 
}: NumPadProps) {
  const handleNumber = (num: string) => {
    if (disabled) return;
    if (value.length >= maxLength) return;
    // Prevent leading zeros
    if (value === "0" && num === "0") return;
    if (value === "0" && num !== "0") {
      onChange(num);
    } else {
      onChange(value + num);
    }
  };

  const handleBackspace = () => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    onChange("");
  };

  const handleSubmit = () => {
    if (disabled || value === "") return;
    onSubmit();
  };

  const buttonBase = `
    flex items-center justify-center 
    rounded-2xl font-bold text-2xl
    transition-all duration-150
    active:scale-95 
    disabled:opacity-40 disabled:cursor-not-allowed
    select-none touch-target no-select numpad-btn
  `;

  const numberButton = `
    ${buttonBase}
    bg-white shadow-md shadow-gray-200/50
    text-foreground
    hover:bg-gray-50
    active:bg-gray-100
    h-16
  `;

  const actionButton = `
    ${buttonBase}
    h-16
  `;

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Row 1: 1-3 */}
        {["1", "2", "3"].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num)}
            disabled={disabled}
            className={numberButton}
          >
            {num}
          </button>
        ))}

        {/* Row 2: 4-6 */}
        {["4", "5", "6"].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num)}
            disabled={disabled}
            className={numberButton}
          >
            {num}
          </button>
        ))}

        {/* Row 3: 7-9 */}
        {["7", "8", "9"].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num)}
            disabled={disabled}
            className={numberButton}
          >
            {num}
          </button>
        ))}

        {/* Row 4: Clear, 0, Backspace */}
        <button
          onClick={handleClear}
          disabled={disabled}
          className={`${actionButton} bg-rose-100 text-rose-600 hover:bg-rose-200 active:bg-rose-300`}
        >
          C
        </button>
        <button
          onClick={() => handleNumber("0")}
          disabled={disabled}
          className={numberButton}
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          disabled={disabled}
          className={`${actionButton} bg-amber-100 text-amber-600 hover:bg-amber-200 active:bg-amber-300`}
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>

      {/* Submit Button */}
      <button
        id="submit-btn"
        onClick={handleSubmit}
        disabled={disabled || value === ""}
        className={`
          ${buttonBase}
          mt-4 w-full h-16
          bg-gradient-to-r from-emerald-400 to-teal-500
          text-white text-xl
          shadow-lg shadow-emerald-200/50
          hover:from-emerald-500 hover:to-teal-600
          active:from-emerald-600 active:to-teal-700
          disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none
        `}
      >
        <Check className="mr-2 h-6 w-6" />
        Sprawdź
      </button>
    </div>
  );
}

