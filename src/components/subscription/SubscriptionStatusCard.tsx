import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { SubscriptionStatus } from "@/types/subscription";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { SubscriptionStatusResponse } from "@/types/subscription";

export function SubscriptionStatusCard(subscription: SubscriptionStatusResponse) {
  const router = useRouter();
  const { setActiveTab } = useSubscriptionStore();
  
  const handleManageSubscription = () => {
    router.push("/subscription/settings");
  };

  const getRemainingTrialDays = () => {
    if (!subscription.trial_end) return null;
    const end = new Date(subscription.trial_end);
    const now = new Date();
    if (end <= now) return 0;
    
    // Calculate days difference
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderSubscriptionStatus = () => {
    if (!subscription.status) return null;

    let statusColor = "text-gray-500";
    let statusBg = "bg-gray-100";
    let statusText = "Unknown";

    switch(subscription.status) {
      case SubscriptionStatus.ACTIVE:
        statusColor = "text-green-500";
        statusBg = "bg-green-100";
        statusText = "Active";
        break;
      case SubscriptionStatus.TRIALING:
        statusColor = "text-blue-500";
        statusBg = "bg-blue-100";
        statusText = "Trial";
        break;
      case SubscriptionStatus.TRIAL_EXPIRED:
        statusColor = "text-orange-500";
        statusBg = "bg-orange-100";
        statusText = "Trial Expired";
        break;
      case SubscriptionStatus.CANCELED:
        statusColor = "text-red-500";
        statusBg = "bg-red-100";
        statusText = "Canceled";
        break;
      default:
        statusColor = "text-gray-600";
        statusBg = "bg-gray-100";
        statusText = 'N/A'
    }

    return (
      <span className={`bg-muted inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
        {statusText}
      </span>
    );
  };

  const clickTabTrigger = (value: string) => {
    setActiveTab(value);
    const element = document.querySelector(`[data-state="inactive"][data-value="${value}"], [data-radix-collection-item][value="${value}"]`) as HTMLElement | null;
    if (element) {
      element.click();
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Subscription Status</CardTitle>
          {renderSubscriptionStatus()}
        </div>
        <CardDescription>
          Your current subscription information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-3">
          
          
          {subscription.billing_cycle && subscription.is_active && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Billing Cycle</span>
              <Badge variant="outline">
                {subscription.billing_cycle.toUpperCase()} billing
              </Badge>
            </div>
          )}
          
          {subscription.status === SubscriptionStatus.TRIALING && subscription.trial_end && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Trial Period</span>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2 bg-blue-50">
                  {getRemainingTrialDays()} days remaining
                </Badge>
                <span className="text-muted-foreground text-sm">
                  Ends on {subscription.trial_end ? format(new Date(subscription.trial_end), 'MMMM dd, yyyy') : 'N/A'}
                </span>
              </div>
            </div>
          )}
          
          {subscription.current_period_end && subscription.is_active && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Period Ends</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{subscription.current_period_end ? format(new Date(subscription.current_period_end), 'MMMM dd, yyyy') : 'N/A'}</span>
              </div>
            </div>
          )}
          
          {subscription.cancel_at_period_end && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Subscription Status</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                Cancels at period end
              </Badge>
            </div>
          )}
          
         
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        {subscription.is_active ? (
          <>
            <Button
              className="w-full sm:w-auto"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => clickTabTrigger('plans')}
            >
              Change Plan
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={() => clickTabTrigger('plans')}
          >
            Subscribe Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 