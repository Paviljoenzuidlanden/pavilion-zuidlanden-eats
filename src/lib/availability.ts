import { addDays, format } from "date-fns";

const iso = (d: Date) => format(d, "yyyy-MM-dd");
const at = (d: string) => new Date(d + "T12:00");

/** All dates between from and to (inclusive) falling on the given weekday (0 = zondag). */
export function recurringDates(weekday: number, from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = at(from); iso(d) <= to; d = addDays(d, 1)) if (d.getDay() === weekday) out.push(iso(d));
  return out;
}

/** Shift a date by a whole number of weeks. */
export const shiftWeeks = (d: string, weeks: number) => iso(addDays(at(d), weeks * 7));
