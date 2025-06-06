"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

interface CalendarWidgetProps {
  importantDates?: Date[]
  title?: string
  description?: string
}

const CalendarWidget = ({ 
  importantDates
}: CalendarWidgetProps) => {
  const [selectedDates, setSelectedDates] = React.useState<Date[] | undefined>(importantDates)
  console.log(setSelectedDates);


  return (
    <Card className="max-w-4xl mx-auto p-6 !shadow-none !border-none max-sm:p-0  min-h-fit">
      {/* Calendar Section */}
      <CardContent>
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onDayClick={(date)=>{
            console.log(date)
          }}
          numberOfMonths={2}
          showOutsideDays
          classNames={{
            months: "flex flex-col lg:flex-row gap-8 justify-center",
            month: "flex flex-col gap-4",
            caption: "flex justify-center pt-2 pb-4 relative items-center w-full",
            caption_label: "text-lg font-semibold ",
            nav: "flex items-center gap-2",
            nav_button: "size-9 bg-secondary rounded-full p-0 transition-colors duration-200 flex items-center justify-center",
            nav_button_previous: "absolute left-2",
            nav_button_next: "absolute right-2",
            table: "w-full border-collapse",
            head_row: "flex mb-2",
            head_cell: " rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center",
            row: "flex w-full mb-1",
            cell: "relative p-0 text-center focus-within:relative focus-within:z-20",
            day: "size-10 p-0 font-medium  hover:bg-secondary rounded-lg transition-all duration-200 aria-selected:bg-red-500 aria-selected:text-white aria-selected:font-bold aria-selected:shadow-md hover:aria-selected:bg-red-300",
            day_today: "bg-orange-100 text-orange-700 font-bold",
            day_outside: "text-gray-400",
            day_disabled: "text-gray-300 cursor-not-allowed",
            day_hidden: "invisible",
          }}
          className="rounded-xl"
        />
      </CardContent>


    </Card>
  )
}

export default CalendarWidget