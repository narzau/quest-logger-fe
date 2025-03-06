// Create a new component called SimpleDatePicker.tsx in your components folder
// This is a simplified calendar that works in Firefox

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);

    // Always create a 6-row calendar (6 weeks) for consistent height
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
            onClick={() => {
              onChange(cloneDay);
              setIsOpen(false);
            }}
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

  // Handle positioning based on viewport
  useEffect(() => {
    const checkPosition = () => {
      if (!containerRef.current || !isOpen) return;

      const rect = containerRef.current.getBoundingClientRect();
      const dropdownEl = containerRef.current.querySelector(
        "[data-calendar-dropdown]"
      );

      if (!dropdownEl) return;

      // Get viewport height
      const viewportHeight = window.innerHeight;

      // Space above and below
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

      // Get dropdown height
      const dropdownHeight = (dropdownEl as HTMLElement).offsetHeight;

      // Apply appropriate positioning class
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        // Not enough space below, but enough above
        dropdownEl.classList.add("bottom-full", "mb-1");
        dropdownEl.classList.remove("top-full", "mt-1");
      } else {
        // Default: show below
        dropdownEl.classList.add("top-full", "mt-1");
        dropdownEl.classList.remove("bottom-full", "mb-1");
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "PPP") : "Select date"}
      </Button>

      {isOpen && (
        <div
          data-calendar-dropdown
          className="absolute bottom-full left-0 right-0 md:right-auto md:w-auto z-50 mb-1 p-3 bg-background border rounded-md shadow-md min-w-[280px]"
        >
          <div className="flex justify-between items-center mb-4">
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
          <div className="mb-3 h-[240px]">{renderCells()}</div>

          <div className="flex justify-between pt-2 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
            >
              Clear
            </Button>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onChange(new Date());
                  setIsOpen(false);
                }}
              >
                Today
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  onChange(tomorrow);
                  setIsOpen(false);
                }}
              >
                Tomorrow
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
