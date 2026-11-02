import { describe, expect, it } from 'vitest';
import { publicQuoteSnapshot, publicationIsAccessible } from '../../supabase/functions/_shared/quote-publication';
describe('offertedocument toegang', () => {
  it('toont alleen offertevelden en geen interne koppeling of klantemail', () => {
    const snapshot = publicQuoteSnapshot({ client_name: 'Gast', quote_number: '2026-002', agenda_id: 'private', client_email: 'private@example.com', recipient: 'private@example.com', access_token: 'secret', items: [] });
    expect(snapshot.client_name).toBe('Gast');
    expect(snapshot).not.toHaveProperty('agenda_id');
    expect(snapshot).not.toHaveProperty('client_email');
    expect(snapshot).not.toHaveProperty('access_token');
    expect(snapshot).not.toHaveProperty('recipient');
  });
  it('weigert documenten waarvan de mail niet is verstuurd', () => {
    expect(publicationIsAccessible({ sent_at: null, expires_at: '2027-01-01' }, new Date('2026-11-02'))).toBe(false);
  });
  it('weigert verlopen documenten', () => {
    expect(publicationIsAccessible({ sent_at: '2026-11-02', expires_at: '2026-11-03' }, new Date('2026-11-03'))).toBe(false);
  });
  it('laat een verstuurde niet-verlopen versie lezen', () => {
    expect(publicationIsAccessible({ sent_at: '2026-11-02', expires_at: '2027-01-01' }, new Date('2026-11-03'))).toBe(true);
  });
});