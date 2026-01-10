"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-styles.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  projectTitle: string;
  assigneeName: string;
  stage: string;
  isDelayed: boolean;
};

type Props = {
  events: CalendarEvent[];
};

export default function CalendarView({ events }: Props) {
  const formattedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <div className="h-[calc(100vh-200px)] rounded-lg border bg-white p-4">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        defaultView="month"
        eventPropGetter={(event: CalendarEvent) => ({
          className: event.isDelayed ? "calendar-event-delayed" : "calendar-event-on-track",
        })}
        components={{
          event: ({ event }: { event: CalendarEvent }) => (
            <div className="text-xs">
              <div className="font-medium">{event.title}</div>
              <div className="text-[10px] opacity-80">{event.assigneeName}</div>
            </div>
          ),
        }}
      />
    </div>
  );
}
