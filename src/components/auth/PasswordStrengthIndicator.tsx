"use client";

import { useEffect, useState } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
  });

  // Update strength indicators whenever password changes
  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  }, [password]); // Re-run when password changes

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p className={passwordStrength.length ? "text-green-500" : "text-red-500"}>
        • At least 8 characters
      </p>
      <p className={passwordStrength.number ? "text-green-500" : "text-red-500"}>
        • At least one number
      </p>
      <p className={passwordStrength.special ? "text-green-500" : "text-red-500"}>
        • At least one special character
      </p>
      <p className={passwordStrength.uppercase ? "text-green-500" : "text-red-500"}>
        • At least one uppercase letter
      </p>
    </div>
  );
}
