export enum PaymentStatus {
  NOT_PAID = "not_paid",
  INVOICED_NOT_APPROVED = "invoiced_not_approved", 
  INVOICED_APPROVED = "invoiced_approved",
  PAID = "paid"
}

export interface TimeEntry {
  id: number;
  date: string; // ISO date string
  start_time: string; // ISO datetime string
  end_time?: string; // ISO datetime string, optional for ongoing sessions
  hourly_rate: number;
  total_hours?: number;
  total_earned?: number;
  payment_status: PaymentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface CreateTimeEntryPayload {
  date?: string;
  start_time?: string;
  end_time?: string;
  hourly_rate: number;
  payment_status?: PaymentStatus;
  notes?: string;
}

export interface UpdateTimeEntryPayload {
  date?: string;
  start_time?: string;
  end_time?: string;
  hourly_rate?: number;
  payment_status?: PaymentStatus;
  notes?: string;
}

export interface TimeTrackingStats {
  total_hours_today: number;
  total_earned_today: number;
  total_hours_week: number;
  total_earned_week: number;
  total_hours_month: number;
  total_earned_month: number;
  unpaid_amount: number;
  invoiced_amount: number;
  paid_amount: number;
}

export interface TimeTrackingSettings {
  default_hourly_rate: number;
  currency: string;
} 