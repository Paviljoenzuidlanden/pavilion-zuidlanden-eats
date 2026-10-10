import type { ComponentType } from 'npm:react@18.3.1'
import { template as signupConfirmation } from './signup-confirmation.tsx'
import { template as signupNotification } from './signup-notification.tsx'
import { template as bookingNotification } from './booking-notification.tsx'
import { template as schedulePublished } from './schedule-published.tsx'
import { template as testNotification } from './test-notification.tsx'

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
  'signup-confirmation': signupConfirmation,
  'signup-notification': signupNotification,
  'booking-notification': bookingNotification,
  'schedule-published': schedulePublished,
  'test-notification': testNotification,
}
