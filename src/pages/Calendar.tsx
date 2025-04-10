
import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Calendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock events data
  const events = [
    { id: 1, date: new Date(2025, 3, 8), title: "Team Meeting", type: "meeting" },
    { id: 2, date: new Date(2025, 3, 10), title: "Project Deadline", type: "deadline" },
    { id: 3, date: new Date(2025, 3, 15), title: "Client Presentation", type: "meeting" },
    { id: 4, date: new Date(2025, 3, 20), title: "Code Review", type: "task" },
    { id: 5, date: new Date(2025, 3, 25), title: "Monthly Report Due", type: "deadline" },
  ];
  
  // Filter events for the selected date
  const selectedDateEvents = events.filter(
    (event) => date && 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );
  
  // Get badge variant based on event type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "meeting": return "primary";
      case "deadline": return "destructive";
      case "task": return "secondary";
      default: return "default";
    }
  };
  
  // Custom day render function to highlight days with events
  const dayRender = (day: Date, modifiers: any) => {
    const hasEvent = events.some(
      event => 
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
    
    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {hasEvent && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Calendar"
        description="View and manage your schedule"
        icon={<Icons.calendar className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-4"
                components={{
                  DayContent: ({ date, activeModifiers }) => dayRender(date, activeModifiers)
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {date ? (
                  <span>Events for {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                ) : (
                  <span>Selected Day Events</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No events scheduled for this date
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex items-start">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary mr-2" />
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center mt-1">
                          <Badge variant={getBadgeVariant(event.type) as any} className="text-xs capitalize">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
