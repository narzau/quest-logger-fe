import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  SubscriptionStatus, 
  BillingCycle, 
  PricingResponse, 
  PaymentHistoryResponse,
  SubscriptionCreateResponse,
  SubscriptionUpdateResponse,
  TrialNotificationResponse,
} from "@/types/subscription";
import { useToast } from "@/components/ui/use-toast";

// Comprehensive subscription data response
interface SubscriptionStatusResponse {
  status: SubscriptionStatus;
  is_active: boolean;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  billing_cycle?: BillingCycle;
  trial_end: string | null;
  plan_id: string | null;
  minutes_used?: number;
  minutes_limit?: number;
  features?: Record<string, boolean>;
  payment_method?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  } | null;
}

export function useSubscription(paymentHistoryLimit: number = 5) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Status and features
  const statusQuery = useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription", "status"],
    queryFn: async () => {
      const response = await api.subscription.getStatus();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Pricing plans with detailed logging
  const plansQuery = useQuery<PricingResponse>({
    queryKey: ["subscription", "plans"],
    queryFn: async () => api.subscription.getPlans(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
  
  // Payment history
  const paymentsQuery = useQuery<PaymentHistoryResponse>({
    queryKey: ["subscription", "payments", paymentHistoryLimit],
    queryFn: () => api.subscription.getPaymentHistory(paymentHistoryLimit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Trial notification
  const trialNotificationQuery = useQuery<TrialNotificationResponse>({
    queryKey: ["subscription", "trial-notification"],
    queryFn: () => api.subscription.getTrialNotification(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Subscribe mutation
  const subscribeMutation = useMutation<
    SubscriptionCreateResponse, 
    Error,
    string
  >({
    mutationFn: (planId: string) => api.subscription.subscribe(planId),
    onSuccess: (data) => {
      if (!data.redirect_url) {
        toast({
          title: "Success",
          description: "Your subscription has been activated!",
          variant: "success",
        });
      }
      
      // Invalidate subscription status to refresh data
      queryClient.invalidateQueries({ queryKey: ["subscription", "status"] });
      queryClient.invalidateQueries({ queryKey: ["subscription", "trial-notification"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
      console.error("Error subscribing:", error);
    },
  });
  
  // Unsubscribe mutation
  const unsubscribeMutation = useMutation<SubscriptionUpdateResponse, Error>({
    mutationFn: () => api.subscription.unsubscribe(),
    onSuccess: () => {
      toast({
        title: "Subscription canceled",
        description: "Your subscription has been canceled and will end at the current billing period.",
        variant: "success",
      });
      
      // Invalidate subscription status to refresh data
      queryClient.invalidateQueries({ queryKey: ["subscription", "status"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
      console.error("Error unsubscribing:", error);
    },
  });
  
  // Change billing cycle mutation
  const changeBillingCycleMutation = useMutation<
    SubscriptionUpdateResponse, 
    Error,
    BillingCycle
  >({
    mutationFn: (cycle: BillingCycle) => api.subscription.changeBillingCycle(cycle),
    onSuccess: () => {
      toast({
        title: "Billing cycle updated",
        description: "Your billing cycle has been updated successfully.",
        variant: "success",
      });
      
      // Invalidate subscription status to refresh data
      queryClient.invalidateQueries({ queryKey: ["subscription", "status"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to change billing cycle. Please try again.",
        variant: "destructive",
      });
      console.error("Error changing billing cycle:", error);
    },
  });
  
  return {
    // Data
    subscription: statusQuery.data,
    plan: plansQuery.data,
    payments: paymentsQuery.data?.payments || [],
    trialNotification: trialNotificationQuery.data || null,
    
    // Loading states
    isStatusLoading: statusQuery.isLoading,
    isPlansLoading: plansQuery.isLoading,
    isPaymentsLoading: paymentsQuery.isLoading,
    isSubscribing: subscribeMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending,
    isChangingBillingCycle: changeBillingCycleMutation.isPending,
    
    // Error states
    statusError: statusQuery.error,
    plansError: plansQuery.error,
    paymentsError: paymentsQuery.error,
    
    // Derived data
    isActive: statusQuery.data?.is_active || false,

    features: statusQuery.data?.features || {},
    minutesUsed: statusQuery.data?.minutes_used || 0,
    minutesLimit: statusQuery.data?.minutes_limit || 0,
    
    // Actions
    subscribe: subscribeMutation.mutate,
    unsubscribe: unsubscribeMutation.mutate,
    changeBillingCycle: changeBillingCycleMutation.mutate,
    
    // Helpers
    refetchStatus: () => queryClient.invalidateQueries({ queryKey: ["subscription", "status"] }),
    refetchPlans: () => queryClient.invalidateQueries({ queryKey: ["subscription", "plans"] }),
    refetchPayments: () => queryClient.invalidateQueries({ queryKey: ["subscription", "payments"] }),
  };
} 