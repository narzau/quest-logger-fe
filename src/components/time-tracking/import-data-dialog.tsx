"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { PaymentStatus } from "@/types/time-tracking";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { parse, format, isValid } from "date-fns";
import { parseTimezoneOffset } from "@/lib/timezone-utils";
import { toast } from "sonner";

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultHourlyRate: number;
}

interface ParsedEntry {
  date: string;
  startTime: string;
  endTime: string;
  isValid: boolean;
  error?: string;
}

export function ImportDataDialog({
  open,
  onOpenChange,
  defaultHourlyRate,
}: ImportDataDialogProps) {
  const [data, setData] = useState("");
  const [parsedEntries, setParsedEntries] = useState<ParsedEntry[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(defaultHourlyRate);
  const { createEntry, settings } = useTimeTracking();
  const timezone = settings?.timezone || "UTC-3";

  const parseData = () => {
    const lines = data.trim().split('\n').filter(line => line.trim());
    const entries: ParsedEntry[] = [];
    
    for (const line of lines) {
      // Skip header line
      if (line.includes('Date') && line.includes('Start Time')) continue;
      if (line.toLowerCase().includes('all paid')) continue;
      
      // Split by tab or multiple spaces
      const parts = line.split(/\t+|\s{2,}/).map(p => p.trim());
      
      if (parts.length >= 3) {
        const [dateStr, startTimeStr, endTimeStr] = parts;
        
        try {
          // Parse date - handle various formats
          let parsedDate;
          // Try DD/MM/YYYY format first
          parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
          if (!isValid(parsedDate)) {
            // Try D/MM/YYYY
            parsedDate = parse(dateStr, 'd/MM/yyyy', new Date());
          }
          if (!isValid(parsedDate)) {
            // Try DD/MM
            parsedDate = parse(dateStr, 'dd/MM', new Date());
            parsedDate.setFullYear(2025);
          }
          if (!isValid(parsedDate)) {
            // Try D/MM
            parsedDate = parse(dateStr, 'd/MM', new Date());
            parsedDate.setFullYear(2025);
          }
          
          if (!isValid(parsedDate)) {
            throw new Error(`Invalid date format: ${dateStr}`);
          }
          
          // Format date as YYYY-MM-DD
          const formattedDate = format(parsedDate, 'yyyy-MM-dd');
          
          // Parse times
          const startParts = startTimeStr.split(':');
          const endParts = endTimeStr.split(':');
          
          if (startParts.length < 2 || endParts.length < 2) {
            throw new Error('Invalid time format');
          }
          
          const startHour = parseInt(startParts[0]);
          const startMin = parseInt(startParts[1]);
          const endHour = parseInt(endParts[0]);
          const endMin = parseInt(endParts[1]);
          
          // Create datetime strings
          const startDateTime = `${formattedDate}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`;
          const endDateTime = `${formattedDate}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
          
          // Handle case where end time is past midnight
          let adjustedEndDateTime = endDateTime;
          if (endHour < startHour || (endHour === 0 && startHour > 12)) {
            // End time is next day
            const nextDay = new Date(parsedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayFormatted = format(nextDay, 'yyyy-MM-dd');
            adjustedEndDateTime = `${nextDayFormatted}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
          }
          
          entries.push({
            date: formattedDate,
            startTime: startDateTime,
            endTime: adjustedEndDateTime,
            isValid: true,
          });
        } catch (error) {
          entries.push({
            date: dateStr,
            startTime: startTimeStr,
            endTime: endTimeStr,
            isValid: false,
            error: error instanceof Error ? error.message : 'Parse error',
          });
        }
      }
    }
    
    setParsedEntries(entries);
  };

  const handleImport = async () => {
    const validEntries = parsedEntries.filter(e => e.isValid);
    if (validEntries.length === 0) {
      toast.error("No valid entries to import");
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;
    
    // Process entries sequentially with a small delay
    for (let i = 0; i < validEntries.length; i++) {
      const entry = validEntries[i];
      
      try {
        // The times from Excel are already in the user's timezone (UTC-3)
        // Since the backend expects UTC, we need to properly convert
        // parseTimezoneOffset returns offset in HOURS (e.g., -3 for UTC-3)
        const offsetHours = parseTimezoneOffset(timezone);
        const absOffsetHours = Math.abs(offsetHours);
        const offsetHoursPart = Math.floor(absOffsetHours);
        const offsetMinsPart = Math.round((absOffsetHours - offsetHoursPart) * 60);
        // For UTC-3, we want -03:00 offset (negative because it's behind UTC)
        const offsetSign = offsetHours > 0 ? '-' : '+';
        const offsetString = `${offsetSign}${String(offsetHoursPart).padStart(2, '0')}:${String(offsetMinsPart).padStart(2, '0')}`;
        
        // Append timezone to make JS parse it correctly
        // e.g., "2025-04-01T13:45:00-03:00"
        const startWithTz = entry.startTime + offsetString;
        const endWithTz = entry.endTime + offsetString;
        
        // Now these will be parsed correctly as local time and converted to UTC
        const startDate = new Date(startWithTz);
        const endDate = new Date(endWithTz);
        
        // Create promise to track completion
        await new Promise<void>((resolve) => {
          createEntry({
            date: entry.date,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            hourly_rate: hourlyRate,
            payment_status: PaymentStatus.PAID,
            notes: "Imported from Excel",
          }, {
            onSuccess: () => {
              successCount++;
              resolve();
            },
            onError: (error) => {
              console.error('Failed to import entry:', entry, error);
              errorCount++;
              resolve(); // Continue with next entry even if this one fails
            }
          });
        });
        
        // Small delay to avoid overwhelming the API
        if (i < validEntries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Failed to import entry:', entry, error);
        errorCount++;
      }
    }

    setIsImporting(false);
    
    if (errorCount === 0) {
      toast.success(`Successfully imported ${successCount} entries!`);
      onOpenChange(false);
      setData("");
      setParsedEntries([]);
    } else {
      toast.error(`Imported ${successCount} entries, but ${errorCount} failed`);
    }
  };

  const validCount = parsedEntries.filter(e => e.isValid).length;
  const invalidCount = parsedEntries.filter(e => !e.isValid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Time Entries from Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <Label htmlFor="import-data">Excel Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Paste your data below. Format: Date, Start Time, End Time
              </p>
              <Textarea
                id="import-data"
                placeholder="31/3/2025	13:00	20:40
1/4/2025	9:00	22:46
..."
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Rate for all entries
              </p>
              <Input
                id="hourly-rate"
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={parseData}
              disabled={!data.trim() || isImporting}
              variant="outline"
            >
              Parse Data
            </Button>
            
            {parsedEntries.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {validCount} valid
                </span>
                {invalidCount > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {invalidCount} invalid
                  </span>
                )}
              </div>
            )}
          </div>

          {parsedEntries.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Preview (first 10 entries):</h3>
              <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                <div className="space-y-1 text-xs font-mono">
                  {parsedEntries.slice(0, 10).map((entry, idx) => (
                    <div
                      key={idx}
                      className={entry.isValid ? "text-green-600" : "text-red-600"}
                    >
                      {entry.isValid ? (
                        `✓ ${entry.date} | ${entry.startTime.split('T')[1]} - ${entry.endTime.split('T')[1]}`
                      ) : (
                        `✗ ${entry.date} | ${entry.startTime} - ${entry.endTime} (${entry.error})`
                      )}
                    </div>
                  ))}
                  {parsedEntries.length > 10 && (
                    <div className="text-muted-foreground">
                      ... and {parsedEntries.length - 10} more entries
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {validCount > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validCount} entries will be imported with:
                <ul className="list-disc list-inside mt-1">
                  <li>Hourly rate: ${hourlyRate}/hr</li>
                  <li>Payment status: Paid</li>
                  <li>Timezone: {timezone}</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={validCount === 0 || isImporting}
          >
            {isImporting ? (
              <>Importing {validCount} entries...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import {validCount} Entries
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 