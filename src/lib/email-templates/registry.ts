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
  hrMessage,
} from './marketplace'
import { adminMorningDigest, orderPaidAdmin } from './admin'
import { studentWelcome, classUnlocked, studentWorkReviewed, graduateReviewRequest, checkoutReminder, paymentConfirmed, orderConfirmed, leadFollowUp } from './student'

export interface TemplateEntry {
  // Each template has its own props, so the registry can't name one props type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
  subject: string | ((data: Record<string, unknown>) => string)
  displayName?: string
  previewData?: Record<string, unknown>
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
  'hr-message': hrMessage,
  'student-welcome': studentWelcome,
  'class-unlocked': classUnlocked,
  'student-work-reviewed': studentWorkReviewed,
  'graduate-review-request': graduateReviewRequest,
  'admin-morning-digest': adminMorningDigest,
  'checkout-reminder': checkoutReminder,
  'payment-confirmed': paymentConfirmed,
  'order-confirmed': orderConfirmed,
  'order-paid-admin': orderPaidAdmin,
  'lead-follow-up': leadFollowUp,
  // Add templates here as they are created, e.g.:
  // 'welcome': welcomeTemplate,
}
