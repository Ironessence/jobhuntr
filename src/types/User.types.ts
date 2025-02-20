import { Job } from "./Job.types";
import { SubscriptionTiers } from "./Subscription.types";

export interface User {
  name: string;
  email: string;
  image: string;
  cv_full_text?: string;
  cv_file_name?: string;
  cv_suggestions?: string[];
  jobs?: Job[];
  tokens: number;
  tier: keyof SubscriptionTiers;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
}
