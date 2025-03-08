import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SimpleDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export function SimpleDatePicker({
  value,
  onChange,
  className,
}: SimpleDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !isDialogOpen // Only close if dialog is not open
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isDialogOpen]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderDays = () => {
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return days.map((day) => (
      <div
        key={day}
        className="text-center text-xs font-semibold py-2 text-muted-foreground"
      >
        {day}
      </div>
    ));
  };

  const handleSelectDate = (selectedDate: Date) => {
    onChange(selectedDate);
    setIsOpen(false);
    setIsDialogOpen(false);
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);

    // Create a consistent 6-row calendar
    const rows = [];
    let days = [];
    let day = startDate;
    let rowCount = 0;
    const totalRowsToShow = 6;

    while (rowCount < totalRowsToShow) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = value && isSameDay(day, value);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "aspect-square flex items-center justify-center relative",
              "text-sm p-1",
              !isCurrentMonth && "text-muted-foreground opacity-50",
              isCurrentMonth && "hover:bg-accent hover:text-accent-foreground",
              "cursor-pointer"
            )}
            onClick={() => handleSelectDate(cloneDay)}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                isToday(day) && !isSelected && "border border-primary",
                isSelected && "bg-primary text-primary-foreground"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
      rowCount++;
    }

    return rows;
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
    setIsDialogOpen(false);
  };

  const handleToday = () => {
    onChange(new Date());
    setIsOpen(false);
    setIsDialogOpen(false);
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onChange(tomorrow);
    setIsOpen(false);
    setIsDialogOpen(false);
  };

  const handleButtonClick = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const renderCalendarContent = () => (
    <>
      <div className="flex justify-between items-center mb-4 mt-8">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={prevMonth}
          className="h-7 w-7 p-0 flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-center px-4">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-7 w-7 p-0 flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 mb-1">{renderDays()}</div>
      <div className="mb-3">{renderCells()}</div>

      <div className="flex justify-between pt-2 border-t">
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          Clear
        </Button>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleToday}
          >
            Today
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleTomorrow}
          >
            Tomorrow
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={handleButtonClick}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : "Select date"}
      </Button>

      {/* Desktop dropdown */}
      {isOpen && !isMobile && (
        <div className="absolute right-0 bottom-full z-50 p-3 mb-1 bg-background border rounded-md shadow-md w-[280px]">
          {renderCalendarContent()}
        </div>
      )}

      {/* Mobile dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[320px] p-4">
          {renderCalendarContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
