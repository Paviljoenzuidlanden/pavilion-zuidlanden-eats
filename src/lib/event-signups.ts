export type EventSignup = {
  id: string;
  event_title: string;
  event_date: string;
  name: string;
  email: string;
  phone: string | null;
  team_name: string | null;
  team_size: number | null;
  reserve: boolean;
  created_at: string;
};

export const eventKey = (signup: Pick<EventSignup, "event_title" | "event_date">) =>
  JSON.stringify([signup.event_title, signup.event_date]);

export function groupEventSignups(rows: EventSignup[]) {
  const groups = new Map<string, { key: string; title: string; date: string; rows: EventSignup[] }>();
  for (const row of rows) {
    const key = eventKey(row);
    const group = groups.get(key);
    if (group) group.rows.push(row);
    else groups.set(key, { key, title: row.event_title, date: row.event_date, rows: [row] });
  }
  return Array.from(groups.values());
}

export function signupTotals(rows: EventSignup[]) {
  const admitted = rows.filter((row) => !row.reserve);
  return {
    admitted: admitted.length,
    reserve: rows.length - admitted.length,
    people: admitted.reduce((total, row) => total + (row.team_name ? row.team_size ?? 0 : 1), 0),
  };
}