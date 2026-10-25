import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import { followupEmail } from '@/lib/lead-followups'

const SITE = 'https://techfaculty.ng'
const WHATSAPP = 'https://wa.me/2348068597140'

const Layout = ({ preview, title, children, cta, href }: { preview: string; title: string; children: React.ReactNode; cta?: string; href?: string }) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>TECH FACULTY</Text>
        <Heading style={h1}>{title}</Heading>
        {children}
        {cta && href && <Button style={button} href={href}>{cta}</Button>}
        <Hr style={hr} />
        <Text style={footer}>Tech Faculty · Train, Certify and Employ</Text>
      </Container>
    </Body>
  </Html>
)

const hi = (name?: string) => (name ? `Hi ${name.split(' ')[0]},` : 'Hi there,')

// 1. Student: enrolment welcome + Faculty ID + Slack
const StudentWelcome = ({ name, facultyId, programme, channel, slackUrl, learningMode }: { name?: string; facultyId?: string; programme?: string; channel?: string; slackUrl?: string; learningMode?: string }) => (
  <Layout preview={`Welcome to ${programme ?? 'Tech Faculty'}`} title="Welcome to Tech Faculty" cta="Open your student dashboard" href={`${SITE}/dashboard`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>You are enrolled in <b>{programme ?? 'your programme'}</b>{learningMode ? ` (${learningMode})` : ''}.</Text>
    {facultyId && <Text style={text}>Your Faculty ID is <b>{facultyId}</b>. Keep it — you need it for classes, assignments and your certificate.</Text>}
    <Text style={text}>Your dashboard shows your next class, the topics to study, your class notes and where to submit each week&apos;s work.</Text>
    {channel && (
      <Text style={text}>
        Your class group on Slack is <b>#{channel}</b>. That is where class briefings, notes and questions live.
      </Text>
    )}
    {slackUrl && <Text style={text}><a href={slackUrl} style={link}>Join the Tech Faculty Slack</a> with this same email address so we can add you to your class group automatically.</Text>}
    <Text style={muted}>Questions about payment, classes or your centre? Reply to this email or message us on WhatsApp.</Text>
  </Layout>
)

// 2. Student: next class unlocked
const ClassUnlocked = ({ name, classTitle, programme, classNumber, date }: { name?: string; classTitle?: string; programme?: string; classNumber?: number; date?: string }) => (
  <Layout preview={`Next class: ${classTitle ?? 'your next topic'}`} title="Your next class is ready" cta="Open your class" href={`${SITE}/dashboard`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>{classNumber ? `Class ${classNumber}` : 'Your next class'} of <b>{programme ?? 'your programme'}</b>: <b>{classTitle ?? 'your next topic'}</b>{date ? ` · ${date}` : ''}.</Text>
    <Text style={text}>Your notes, reading list and the assignment for this class are on your dashboard. Submit your work there when you are done so it counts toward your certificate.</Text>
  </Layout>
)

// 3. Student: work reviewed
const StudentWorkReviewed = ({ name, title, status, note, score }: { name?: string; title?: string; status?: string; note?: string; score?: number }) => (
  <Layout preview={status === 'needs_changes' ? 'Changes requested on your assignment' : 'Your assignment was reviewed'} title={status === 'needs_changes' ? 'Changes requested' : 'Assignment reviewed'} cta="See your progress" href={`${SITE}/dashboard`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>Your submission <b>{title ?? ''}</b> was {status === 'needs_changes' ? 'returned for changes' : 'reviewed and accepted'}{typeof score === 'number' ? ` with a score of ${score}%` : ''}.</Text>
    {note && <Text style={quote}>{note}</Text>}
    <Text style={muted}>Every accepted submission moves you closer to your assessment and certificate.</Text>
  </Layout>
)

// 4. Graduate: ask for a Google review once their certificate is issued
const GraduateReviewRequest = ({ name, courseName, reviewUrl }: { name?: string; courseName?: string; reviewUrl?: string }) => (
  <Layout preview="Congratulations on your certificate" title="Congratulations, graduate!" cta="Leave a Google review" href={reviewUrl}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>Your certificate{courseName ? <> for <b>{courseName}</b></> : null} has been issued. Well done, you earned it.</Text>
    <Text style={text}>Would you take a minute to tell others about your time at Tech Faculty NG? A short Google review helps the next student find us and decide with confidence.</Text>
    <Text style={muted}>Thank you for learning with us. We are proud of you and glad to stay in touch.</Text>
  </Layout>
)

// 7. Lead: follow-up sequence after an enquiry (copy in src/lib/lead-followups.ts)
const LeadFollowUp = ({ name, interest, step, unsubscribeUrl }: { name?: string; interest?: string; step?: number; unsubscribeUrl?: string }) => {
  const email = followupEmail(interest ?? 'general', step ?? 0) ?? followupEmail('general', 0)!
  return (
    <Layout preview={email.preview} title={email.title} cta={email.cta} href={email.href}>
      <Text style={text}>{hi(name)}</Text>
      {email.paragraphs.map((p) => (
        <Text key={p} style={text}>{p}</Text>
      ))}
      <Text style={muted}>Questions? Reply to this email or <a href={WHATSAPP} style={link}>message us on WhatsApp</a>.</Text>
      {unsubscribeUrl && (
        <Text style={muted}>You are getting this because you contacted Tech Faculty NG. <a href={unsubscribeUrl} style={link}>Stop these emails</a>.</Text>
      )}
    </Layout>
  )
}

export const studentWelcome = {
  component: StudentWelcome,
  subject: (d) => `Welcome to ${d.programme ?? 'Tech Faculty'} — your Faculty ID and class group`,
  displayName: 'Student enrolment welcome',
  previewData: { name: 'Ada Obi', facultyId: 'TF-WEBDEV-ONL-0926-0001', programme: 'AI for Full-Stack Web Development', channel: 'course-ai-web-dev', slackUrl: 'https://tech-faculty.slack.com', learningMode: 'Hybrid Mode' },
} satisfies TemplateEntry

export const classUnlocked = {
  component: ClassUnlocked,
  subject: (d) => `Next class: ${d.classTitle ?? 'your next topic'}`,
  displayName: 'Next class unlocked',
  previewData: { name: 'Ada Obi', classTitle: 'Building APIs with AI assistance', programme: 'AI for Full-Stack Web Development', classNumber: 3, date: '12 October 2026' },
} satisfies TemplateEntry

export const studentWorkReviewed = {
  component: StudentWorkReviewed,
  subject: (d) => (d.status === 'needs_changes' ? 'Changes requested on your assignment' : 'Your assignment was reviewed'),
  displayName: 'Student assignment reviewed',
  previewData: { name: 'Ada Obi', title: 'Week 3 project', status: 'reviewed', note: 'Clean work — add tests next time.', score: 82 },
} satisfies TemplateEntry

export const graduateReviewRequest = {
  component: GraduateReviewRequest,
  subject: 'Congratulations! Would you review Tech Faculty NG?',
  displayName: 'Graduate Google review request',
  previewData: { name: 'Ada Obi', courseName: 'Fullstack Web Development', reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ5ZxSzmi9QxAR23OzR7YbAkM' },
} satisfies TemplateEntry

// 5. Student: card checkout started but never paid
const CheckoutReminder = ({ name, plan, amount }: { name?: string; plan?: string; amount?: string }) => (
  <Layout preview="Your Tech Faculty enrolment is waiting for payment" title="Finish your enrolment" cta="Finish enrolling" href={`${SITE}/#pricing`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>You started enrolling in the <b>{plan ?? 'Tech Faculty'}</b> plan{amount ? ` (${amount})` : ''}, but the card payment was not completed, so your place is not confirmed yet.</Text>
    <Text style={text}>Choose your plan again and pay to unlock your classes and class group.</Text>
    <Text style={muted}>Already paid? You don&apos;t need to do anything. We check card payments with Flutterwave automatically and will email you once yours is confirmed.</Text>
    <Text style={muted}>Card declined, or prefer to pay by bank transfer? <a href={WHATSAPP} style={link}>Message us on WhatsApp</a> and we will help you finish.</Text>
  </Layout>
)

// 6. Student: card payment confirmed by the scheduled re-check
const PaymentConfirmed = ({ name, plan, facultyId }: { name?: string; plan?: string; facultyId?: string }) => (
  <Layout preview="Your payment is confirmed" title="Your payment is confirmed" cta="Open your student dashboard" href={`${SITE}/dashboard`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>Flutterwave has confirmed your payment for the <b>{plan ?? 'Tech Faculty'}</b> plan, so your enrolment is now active.</Text>
    {facultyId && <Text style={text}>Your Faculty ID is <b>{facultyId}</b>.</Text>}
    <Text style={text}>Open your dashboard to see your classes. Your class group opens the first time you visit it.</Text>
  </Layout>
)

export const checkoutReminder = {
  component: CheckoutReminder,
  subject: 'Finish your Tech Faculty enrolment',
  displayName: 'Unfinished checkout reminder',
  previewData: { name: 'Ada Obi', plan: 'Developer Pro', amount: '₦100,000' },
} satisfies TemplateEntry

export const paymentConfirmed = {
  component: PaymentConfirmed,
  subject: (d) => `Payment confirmed: you're enrolled in ${d.plan ?? 'Tech Faculty'}`,
  displayName: 'Card payment confirmed later',
  previewData: { name: 'Ada Obi', plan: 'Developer Pro', facultyId: 'TF-WEBDEV-ONL-0926-0001' },
} satisfies TemplateEntry

export const leadFollowUp = {
  component: LeadFollowUp,
  subject: (d) => (followupEmail(String(d.interest ?? 'general'), Number(d.step ?? 0)) ?? followupEmail('general', 0)!).subject,
  displayName: 'Lead follow-up (1, 3 and 7 days after an enquiry)',
  previewData: { name: 'Ada Obi', interest: 'virtual_siwes', step: 0, unsubscribeUrl: 'https://techfaculty.ng/api/lead-unsubscribe?t=00000000-0000-0000-0000-000000000000' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '2px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333333', margin: '0 0 14px' }
const muted = { fontSize: '13px', lineHeight: '20px', color: '#777777', margin: '0 0 14px' }
const quote = { fontSize: '14px', lineHeight: '22px', color: '#333333', borderLeft: '3px solid #000000', paddingLeft: '12px', margin: '0 0 14px' }
const link = { color: '#000000', textDecoration: 'underline' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }
