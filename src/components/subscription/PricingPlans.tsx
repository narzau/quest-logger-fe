import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { BillingCycle, SubscriptionPlan } from "@/types/subscription";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

interface PricingPlansProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  activePlanId: string | null;
  isActive: boolean;
}

export function PricingPlans({ plans, isLoading, activePlanId, isActive }: PricingPlansProps) {
  const { selectedCycle, setSelectedCycle } = useSubscriptionStore();
  const { subscribe, isSubscribing } = useSubscription();
  
  // For debugging in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PricingPlans component received plans:', plans);
      console.log('Current selected cycle:', selectedCycle);
    }
  }, [plans, selectedCycle]);

  // Helper to format currency in dollars
  const formatCurrency = (price: number | undefined, currencyCode = 'USD'): string => {
    if (price === undefined) {
      console.error('Price is undefined');
      return '$0.00';
    }
    
    try {
      // If price is in cents, convert to dollars
      const priceInDollars = price > 100 ? price / 100 : price;
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(priceInDollars);
    } catch (error) {
      console.error('Error formatting price:', error, 'Price value:', price);
      return `$${price.toFixed(2)}`;
    }
  };

  // Handle cycle toggle
  const handleCycleChange = (cycle: BillingCycle) => {
    console.log('Changing billing cycle to:', cycle);
    setSelectedCycle(cycle);
  };

  // Filter plans by selected cycle
  const getVisiblePlans = () => {
    // Ensure plans is an array
    if (!Array.isArray(plans) || plans.length === 0) {
      console.warn('No valid plans available or plans is not an array');
      return [];
    }

    // Log each plan to help debug
    plans.forEach((plan, index) => {
      if (!plan) {
        console.warn('Plan at index', index, 'is undefined or null');
        return;
      }
      
      console.log(`Plan ${index} details:`, {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
      });
    });

    // Filter by the selected cycle
    const filteredPlans = plans.filter(plan => {
      if (!plan || !plan.interval) {
        console.warn('Plan or plan.interval is undefined', plan);
        return false;
      }
      
      // Normalize interval to handle different formats
      const normalizedInterval = typeof plan.interval === 'string' 
        ? plan.interval.toLowerCase() 
        : String(plan.interval).toLowerCase();
      
      // Check if it matches the selected cycle
      return normalizedInterval.includes(selectedCycle.toLowerCase());
    });

    // If we have filtered plans, return them; otherwise fall back to all plans
    if (filteredPlans.length > 0) {
      return filteredPlans;
    } else {
      console.warn('No plans found for cycle', selectedCycle, 'showing all plans');
      return plans;
    }
  };

  // Get the plans to display
  const visiblePlans = getVisiblePlans();

  // Debug information
  const debugInfo = process.env.NODE_ENV === 'development' && (
    <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded-md">
      <p><strong>Debug:</strong> Selected Cycle: {selectedCycle}</p>
      <p>Total Plans: {plans?.length || 0}</p>
      <p>Visible Plans: {visiblePlans?.length || 0}</p>
      <p>First Plan Interval (if any): {plans?.[0]?.interval}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            className={cn(
              "flex-1",
              selectedCycle === BillingCycle.MONTHLY && "bg-primary/10"
            )}
            disabled
          >
            Monthly
          </Button>
          <Button
            variant="outline"
            className={cn(
              "flex-1",
              selectedCycle === BillingCycle.ANNUAL && "bg-primary/10"
            )}
            disabled
          >
            Annual
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader className="h-24 bg-gray-200" />
            <CardContent className="h-64 bg-gray-100" />
          </Card>
          <Card className="animate-pulse">
            <CardHeader className="h-24 bg-gray-200" />
            <CardContent className="h-64 bg-gray-100" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            selectedCycle === BillingCycle.MONTHLY && "bg-primary/10"
          )}
          onClick={() => handleCycleChange(BillingCycle.MONTHLY)}
        >
          Monthly
        </Button>
        <Button
          variant="outline"
          className={cn(
            "flex-1",
            selectedCycle === BillingCycle.ANNUAL && "bg-primary/10"
          )}
          onClick={() => handleCycleChange(BillingCycle.ANNUAL)}
        >
          Annual
        </Button>
      </div>

      {visiblePlans.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No plans available</CardTitle>
            <CardDescription>
              We&apos;re experiencing technical difficulties. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visiblePlans.map((plan) => {
            if (!plan || !plan.id) {
              console.warn('Invalid plan object:', plan);
              return null;
            }
            
            // Log the raw price for debugging
            console.log(`Raw price for plan ${plan.name}:`, plan.price);
            
            return (
              <Card key={plan.id} className={plan.name?.includes('Pro') ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle>{plan.name || 'Unnamed Plan'}</CardTitle>
                  <CardDescription>
                    {plan.description || 'No description available'}
                  </CardDescription>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /{selectedCycle === BillingCycle.MONTHLY ? 'month' : 'year'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {Array.isArray(plan.features) ? (
                      plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No features specified</li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => subscribe(plan.id)}
                    disabled={isSubscribing || (isActive && activePlanId === plan.id)}
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isActive && activePlanId === plan.id ? (
                      "Current Plan"
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {debugInfo}
    </div>
  );
} 