"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";

interface TimeTrackingMonthFilterProps {
  onMonthChange: (startDate: Date, endDate: Date) => void;
  currentMonth: Date;
  onCurrentMonthChange: (month: Date) => void;
}

export function TimeTrackingMonthFilter({
  onMonthChange,
  currentMonth,
  onCurrentMonthChange,
}: TimeTrackingMonthFilterProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
  const selectedMonthIndex = currentMonth.getMonth();
  const selectedYear = currentMonth.getFullYear();

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    onMonthChange(start, end);
  }, [currentMonth, onMonthChange]);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(selectedYear, parseInt(monthIndex), 1);
    onCurrentMonthChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), selectedMonthIndex, 1);
    onCurrentMonthChange(newDate);
  };

  const handlePreviousMonth = () => {
    onCurrentMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onCurrentMonthChange(addMonths(currentMonth, 1));
  };

  const handleCurrentMonth = () => {
    onCurrentMonthChange(new Date());
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by Month:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Select
          value={selectedMonthIndex.toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={selectedYear.toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleCurrentMonth}
        className="h-8"
      >
        Current Month
      </Button>
      
      <div className="text-sm text-muted-foreground">
        Showing: {format(currentMonth, "MMMM yyyy")}
      </div>
    </div>
  );
} 