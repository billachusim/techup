import type { ComponentType } from 'react'
import {
  applicationReceived,
  newApplicationAdmin,
  matchUpdate,
  deliverableReviewed,
  talentApproved,
  profileSubmitted,
  introRequestReceived,
  introRequestAdmin,
  introApproved,
  hiringRequestReceived,
  hiringRequestAdmin,
} from './marketplace'
import { studentWelcome, classUnlocked, studentWorkReviewed } from './student'

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
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'application-received': applicationReceived,
  'new-application-admin': newApplicationAdmin,
  'match-update': matchUpdate,
  'deliverable-reviewed': deliverableReviewed,
  'talent-approved': talentApproved,
  'profile-submitted': profileSubmitted,
  'intro-request-received': introRequestReceived,
  'intro-request-admin': introRequestAdmin,
  'intro-approved': introApproved,
  'hiring-request-received': hiringRequestReceived,
  'hiring-request-admin': hiringRequestAdmin,
  // Add templates here as they are created, e.g.:
  // 'welcome': welcomeTemplate,
}
