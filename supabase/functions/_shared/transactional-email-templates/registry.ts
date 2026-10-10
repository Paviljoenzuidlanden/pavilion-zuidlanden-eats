import type { ComponentType } from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'signup-confirmation': import('./signup-confirmation.tsx').then((m) => m.template) as never,
  'signup-notification': import('./signup-notification.tsx').then((m) => m.template) as never,
  'booking-notification': import('./booking-notification.tsx').then((m) => m.template) as never,
  'schedule-published': import('./schedule-published.tsx').then((m) => m.template) as never,
}
