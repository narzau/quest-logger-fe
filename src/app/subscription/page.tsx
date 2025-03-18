"use client";

import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, HelpCircle, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { format } from "date-fns";

// Custom hooks
import { useSubscription } from "@/hooks/useSubscription";
import { BillingCycle, SubscriptionStatus } from "@/types/subscription";
import { useUser } from "@/hooks/useUser";
import AnimatedProgress from "@/components/ui/animated-progress";

// Helper functions for subscription status and rendering
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM d, yyyy");
};

export default function SubscriptionPage() {
  // Use the consolidated subscription hook
  const { 
    subscription,
    payments,
    plan,
    isStatusLoading,
    isPaymentsLoading,
    changeBillingCycle,
    subscribe,
  } = useSubscription(5); // Get 5 most recent payments
  const { user } = useUser();
  
  // Calculate hasActiveAccess once for the entire component
  const currentDate = new Date();
  const periodEndDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const hasActiveAccess = periodEndDate && periodEndDate > currentDate;
  
  // Status helper functions
  const isActive = subscription?.status === SubscriptionStatus.ACTIVE;
  const isTrialing = subscription?.status === SubscriptionStatus.TRIALING;
  const isCanceled = subscription?.status === SubscriptionStatus.CANCELED;
  const isTrialExpired = subscription?.status === SubscriptionStatus.TRIAL_EXPIRED;
  const isPastDue = subscription?.status === SubscriptionStatus.PAST_DUE;
  const isIncomplete = subscription?.status === SubscriptionStatus.INCOMPLETE;
  const isIncompleteExpired = subscription?.status === SubscriptionStatus.INCOMPLETE_EXPIRED;
  const isUnpaid = subscription?.status === SubscriptionStatus.UNPAID;
  const isNone = subscription?.status === SubscriptionStatus.NONE;
  
  // Compound status helpers
  const isActiveOrCanceledWithAccess = isActive || (isCanceled && hasActiveAccess);
  const isIncompleteStatus = isIncomplete || isIncompleteExpired;
  const showMonthlyBillingNotice = subscription?.billing_cycle === BillingCycle.MONTHLY && 
    (isCanceled || isActive);
  
  // Handle upgrade to annual plan
  const handleUpgradeToAnnual = () => {
    if (subscription?.plan_id) {
      changeBillingCycle(BillingCycle.ANNUAL);
    }
  };

  // Handle resubscribe action
  const handleResubscribe = () => {
    if (subscription?.plan_id) {
      subscribe(subscription.plan_id);
    }
  };

  // Render header content based on subscription status
  const renderHeaderContent = () => {
    if (isActiveOrCanceledWithAccess) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Subscribed</p>
          <h1 className="text-2xl font-bold">Thanks for being a subscriber, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isTrialing) {
      return (
        <>
          <div className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Trial Active</div>
          <h1 className="text-2xl font-bold">Enjoying your trial, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isPastDue) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Payment Past Due</p>
          <h1 className="text-2xl font-bold">Your payment is overdue, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isUnpaid) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Payment Failed</p>
          <h1 className="text-2xl font-bold">We couldn&apos;t process your payment, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isIncompleteStatus) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70py-0.5 px-2 rounded-lg w-fit mb-2">Incomplete Setup</p>
          <h1 className="text-2xl font-bold">Your subscription setup is incomplete, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isCanceled) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Subscription Ended</p>
          <h1 className="text-2xl font-bold">Your access has ended, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isTrialExpired) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Trial Expired</p>
          <h1 className="text-2xl font-bold">Your trial has ended, {user?.username || "User"}</h1>
        </>
      );
    }
    
    if (isNone) {
      return (
        <>
          <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">No Subscription</p>
          <h1 className="text-2xl font-bold">Hello, {user?.username || "User"}</h1>
        </>
      );
    }
    
    return (
      <>
        <p className="text-sm font-medium bg-primary/70 py-0.5 px-2 rounded-lg w-fit mb-2">Subscription</p>
        <h1 className="text-2xl font-bold">Hello, {user?.username || "User"}</h1>
      </>
    );
  };

  // Render payment status based on subscription status
  const renderPaymentStatus = () => {
    if (isActive) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <p className="font-medium">Active subscription</p>
          </div>
          <p className="text-sm ">
            {subscription?.cancel_at_period_end 
              ? `Plan ends on ${formatDate(subscription.current_period_end)}`
              : `Next renewal on ${formatDate(subscription.current_period_end)}`
            }
          </p>
        </>
      );
    }
    
    if (isTrialing) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="font-medium">Trial subscription</p>
          </div>
          <p className="text-sm ">
            Trial ends on {formatDate(subscription?.trial_end)}
          </p>
        </>
      );
    }
    
    if (isPastDue) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="font-medium">Payment past due</p>
          </div>
          <p className="text-sm ">
            Please update your payment information
          </p>
        </>
      );
    }
    
    if (isUnpaid) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="font-medium">Payment failed</p>
          </div>
          <p className="text-sm ">
            We couldn&apos;t process your last payment
          </p>
        </>
      );
    }
    
    if (isIncomplete) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-primaryflex-shrink-0" />
            <p className="font-medium">Subscription incomplete</p>
          </div>
          <p className="text-sm ">
            Please complete your subscription setup
          </p>
        </>
      );
    }
    
    if (isIncompleteExpired) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="font-medium">Subscription setup expired</p>
          </div>
          <p className="text-sm ">
            Your subscription setup has expired
          </p>
        </>
      );
    }
    
    if (isTrialExpired) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="font-medium">Trial expired</p>
          </div>
          <p className="text-sm ">
            Your free trial has ended
          </p>
        </>
      );
    }
    
    if (isCanceled) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 flex-shrink-0 text-primary" />
            <p className="font-medium">Subscription canceled</p>
          </div>
          <p className="text-sm ">
            {hasActiveAccess && subscription?.current_period_end 
              ? "Plan ends on " + formatDate(subscription.current_period_end) 
              : "Your subscription has ended"
            }
          </p>
        </>
      );
    }
    
    if (isNone) {
      return (
        <>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="font-medium">No subscription</p>
          </div>
          <p className="text-sm ">
            You don&apos;t have an active subscription
          </p>
        </>
      );
    }
    
    return (
      <>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
          <p className="font-medium">Subscription status</p>
        </div>
        <p className="text-sm ">
          {subscription?.status || 'Unknown status'}
        </p>
      </>
    );
  };

  // Render action buttons based on subscription status
  const renderActionButtons = () => {
    if (isPastDue || isUnpaid) {
      return (
        <Button 
          variant="default"
          onClick={() => {
            // Handle update payment method
          }}
        >
          Update Payment
        </Button>
      );
    }
    
    if (isIncompleteStatus) {
      return (
        <Button 
          variant="default"
          onClick={() => {
            // Handle complete subscription
          }}
        >
          Complete Setup
        </Button>
      );
    }
    
    if (isCanceled || isTrialExpired || isNone) {
      return (
        <Button 
          onClick={handleResubscribe}
          variant="outline"
        >
          {isNone ? "Subscribe" : "Resubscribe"}
        </Button>
      );
    }
    
    if (isActive && !subscription?.cancel_at_period_end) {
      return (
        <Button 
          variant="outline"
          onClick={() => {
            // Handle cancel subscription
          }}
        >
          Cancel
        </Button>
      );
    }
    
    if (isTrialing) {
      return (
        <Button 
          variant="outline"
          onClick={() => {
            // Handle upgrading from trial
          }}
        >
          Upgrade Now
        </Button>
      );
    }
    
    return null;
  };

  if (!subscription) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg text-muted-foreground">No subscription found.</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }
  
  if (isStatusLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Loading subscription information...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-0  max-w-6xl">
          {/* Header Section */}
          <div className="bg-primary/60 rounded-t-lg p-6 py-12">
            <div className="">
              {renderHeaderContent()}
            </div>
          </div>

          {/* Account Info Section */}
          <div className="border-b border-l border-r rounded-b-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div>
                <p className="text-sm  mb-1">Billing cycle</p>
                <p className="text-lg font-semibold">
                  {subscription?.billing_cycle ? subscription?.billing_cycle[0].toUpperCase() + subscription?.billing_cycle.slice(1) + " plan" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm  mb-1">Next invoice</p>
                <p className="text-lg font-semibold">
                  {isActive && !subscription?.cancel_at_period_end
                    ? formatDate(subscription.current_period_end)
                    : "No upcoming invoice"}
                </p>
              </div>
              <div>
                <p className="text-sm  mb-2">Available recording time</p>
                <AnimatedProgress
                  value={(subscription?.minutes_used || 0) / (subscription?.minutes_limit || 0) * 100}
                />
                <p className="text-sm mt-2 ">{Math.round(subscription?.minutes_used || 0)} / {subscription?.minutes_limit || 0} minutes used</p>
              </div>
            </div>

            {/* Monthly billing notice - only show for active or canceled subscriptions */}
            {showMonthlyBillingNotice && (
              <div className="mt-6 p-4 border rounded-lg flex justify-between items-center">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">You are on a monthly billing plan.</p>
                    <p className="text-sm">Pay annually to save {plan ? Math.round((plan?.price?.monthly_price * 12 * 100 / plan?.price?.annual_price) - 100) : 0}%.</p>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgradeToAnnual}
                  variant="outline"
                >
                  Upgrade to Annual
                </Button>
              </div>
            )}
            
            {!subscription?.billing_cycle && (
              <div className="mt-6 p-4 border rounded-lg flex justify-between items-center">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Did you know?</p>
                    <p className="text-sm">You can save {plan ? Math.round((plan?.price?.monthly_price * 12 * 100 / plan?.price?.annual_price) - 100) : 0}% by paying annually.</p>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgradeToAnnual}
                  variant="outline"
                >
                  Upgrade to Annual
                </Button>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            
            <div className="flex justify-between items-center">
              <div>
                {renderPaymentStatus()}
              </div>
              
              {/* Action buttons based on subscription status */}
              <div>
                {renderActionButtons()}
              </div>
            </div>
          </div>

          {/* Invoices Section */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Invoices</h2>
            
            {isPaymentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin " />
              </div>
            ) : payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left pb-2 font-medium">Date</th>
                      <th className="text-left pb-2 font-medium">Total</th>
                      <th className="text-left pb-2 font-medium">Status</th>
                      <th className="text-right pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-zinc-800">
                        <td className="py-4">{formatDate(payment.date)}</td>
                        <td className="py-4">
                          ${(payment.amount / 100).toFixed(2)}
                        </td>
                        <td className="py-4 capitalize">
                          {payment.status === "succeeded" ? "Paid" : payment.status}
                        </td>
                        <td className="py-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (payment.receipt_url) {
                                window.open(payment.receipt_url, '_blank');
                              }
                            }}
                            disabled={!payment.receipt_url}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className=" py-4">No invoices found.</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}