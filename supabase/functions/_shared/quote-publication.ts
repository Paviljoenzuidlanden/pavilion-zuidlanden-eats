export function publicQuoteSnapshot(quote: Record<string, unknown>) {
  const fields = ["id", "quote_number", "status", "client_name", "event_date", "start_time", "end_time", "guests_text", "guests_count", "occasion", "location", "intro", "items", "drinks_text", "drink_tokens_per_guest", "notes", "signed_by", "sent_at"];
  return Object.fromEntries(fields.map(field => [field, quote[field] ?? null]));
}

export function publicationIsAccessible(publication: { sent_at: string | null; expires_at: string }, now = new Date()) {
  return Boolean(publication.sent_at) && new Date(publication.expires_at).getTime() > now.getTime();
}