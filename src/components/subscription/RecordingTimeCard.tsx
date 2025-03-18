import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Info, Mic, Zap } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";

interface RecordingTimeCardProps {
  minutesUsed: number;
  minutesLimit: number;
  isActive: boolean;
}

export function RecordingTimeCard({ minutesUsed, minutesLimit, isActive }: RecordingTimeCardProps) {
  const { setActiveTab } = useSubscriptionStore();
  
  const getMinutesUsagePercentage = () => {
    if (minutesLimit <= 0) return 0;
    const percentage = (minutesUsed / minutesLimit) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours === 0) {
      return `${mins} minutes`;
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} minutes`;
    }
  };
  
  const clickTabTrigger = (value: string) => {
    setActiveTab(value);
    const element = document.querySelector(`[data-state="inactive"][data-value="${value}"], [data-radix-collection-item][value="${value}"]`) as HTMLElement | null;
    if (element) {
      element.click();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Recording Time
        </CardTitle>
        <CardDescription>
          Your monthly recording time usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used</span>
            <span>
              {formatMinutes(minutesUsed)} / {formatMinutes(minutesLimit)}
            </span>
          </div>
          <Progress value={getMinutesUsagePercentage()} className="h-2" />
        </div>
        
        <div className="pt-2">
          {minutesLimit > 0 ? (
            <div className="text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                You have {formatMinutes(minutesLimit - minutesUsed)} of recording time remaining for this billing period.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-amber-50 text-amber-800 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">No recording time available</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isActive && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => clickTabTrigger('plans')}
          >
            <Zap className="mr-2 h-4 w-4" />
            Upgrade to get more recording time
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 