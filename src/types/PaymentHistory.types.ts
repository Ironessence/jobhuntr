export interface PaymentHistory {
  amount: number;
  tokens: number;
  date: Date;
  stripePaymentId: string;
  status: string;
  errorMessage?: string;
}
