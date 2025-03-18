import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, BadgeCheck, Check, Star } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface FeaturesCardProps {
  features: Record<string, boolean>;
  isActive: boolean;
}

export function FeaturesCard({ features, isActive }: FeaturesCardProps) {
  const { setActiveTab } = useSubscriptionStore();

  const clickTabTrigger = (value: string) => {
    setActiveTab(value);
    const element = document.querySelector(`[data-state="inactive"][data-value="${value}"], [data-radix-collection-item][value="${value}"]`) as HTMLElement | null;
    if (element) {
      element.click();
    }
  };

  return (
    <Card className="md:col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Features
        </CardTitle>
        <CardDescription>
          Features available with your current plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              {features?.SHARING ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              )}
              Sharing
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {features?.SHARING ? 
                "Share your notes with others" : 
                "Upgrade to share your notes"
              }
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              {features?.EXPORTING ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              )}
              Exporting
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {features?.EXPORTING ? 
                "Export notes to multiple formats" : 
                "Upgrade to export your notes"
              }
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              {features?.PRIORITY_PROCESSING ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              )}
              Priority Processing
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {features?.PRIORITY_PROCESSING ? 
                "Get faster processing for your recordings" : 
                "Upgrade for faster processing"
              }
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium flex items-center">
              {features?.ADVANCED_AI ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              )}
              Advanced AI
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {features?.ADVANCED_AI ? 
                "Access to advanced AI features" : 
                "Upgrade for advanced AI features"
              }
            </p>
          </div>
        </div>
      </CardContent>
      {!isActive && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => clickTabTrigger('plans')}
          >
            <BadgeCheck className="mr-2 h-4 w-4" />
            Upgrade to Access All Features
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 