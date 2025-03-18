import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentHistoryItem } from "@/types/subscription";
import { ExternalLink, Loader2, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface PaymentHistoryCardProps {
  payments: PaymentHistoryItem[];
  isLoading: boolean;
}

export function PaymentHistoryCard({ payments, isLoading }: PaymentHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Payment History
        </CardTitle>
        <CardDescription>
          Your recent payments and invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No payment history available
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">
                    {format(new Date(payment.date), 'MMMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency.toUpperCase()
                    }).format(payment.amount)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={
                      payment.status === 'succeeded' ? 'bg-green-50 text-green-700' :
                      payment.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                  
                  {payment.receipt_url && (
                    <Button variant="ghost" size="sm" className="h-8" asChild>
                      <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 