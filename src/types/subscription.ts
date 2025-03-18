export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  CANCELED = 'canceled',
  TRIAL_EXPIRED = 'trial_expired',
  PAST_DUE = 'past_due',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  UNPAID = 'unpaid',
  NONE = 'none',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: BillingCycle;
  features: string[];
}

export interface SubscriptionStatusResponse {
  status: SubscriptionStatus;
  is_active: boolean;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  billing_cycle: BillingCycle;
  trial_end: string | null;
  plan_id: string | null;
}



export interface PricingResponse {
  price: PriceInfo;
  promotional_codes?: PromotionalCode[];
}

export interface PriceInfo {
  display_name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  monthly_minutes_limit: number;
  features: string[];
}

export interface PromotionalCode {
  code: string;
  description: string;
  percent_off: number;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscription_id?: string;
  customer_id?: string;
  status?: SubscriptionStatus;
}

export interface PaymentMethodResponse {
  success: boolean;
  message: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  date: string;
  receipt_url?: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentHistoryItem[];
  has_more: boolean;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface TrialNotificationResponse {
  show: boolean;
  message: string;
  type: 'warning' | 'error';
  days_remaining?: number;
}

export interface SubscriptionCreateResponse {
  success: boolean;
  redirect_url?: string;
  error?: string;
}

export interface SubscriptionUpdateResponse {
  success: boolean;
  error?: string;
} 