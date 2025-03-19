"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatters";

export default function PaymentHistory() {
  const { user } = useUserContext();

  if (!user?.paymentHistory || user.paymentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your token purchase history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No purchases yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Your token purchase history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.paymentHistory
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((payment, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium">{payment.tokens.toLocaleString()} Tokens</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(new Date(payment.date))}
                  </p>
                </div>
                <p className="font-medium">${payment.amount.toFixed(2)}</p>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
