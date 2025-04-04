import React, { useState } from "react";
import {
  BarChart,
  Calendar,
  CreditCard,
  FileText,
  Filter,
  Printer,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "../../../components/ui/calendar";
import { addDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement> & { className?: string }) {
  const [date, setDate] = useState<DateRange>({
    from: new Date(2023, 0, 15),
    to: addDays(new Date(2023, 0, 15), 5),
  });

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className="h-8 border-dashed"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date as any}
            onSelect={(newDate) => setDate(newDate as DateRange)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ... existing code ...
