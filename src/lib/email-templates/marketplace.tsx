import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE = 'https://techfaculty.ng'

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
        <Text style={footer}>Tech Faculty Talent Marketplace · Train, Certify and Employ</Text>
      </Container>
    </Body>
  </Html>
)

const hi = (name?: string) => (name ? `Hi ${name.split(' ')[0]},` : 'Hi there,')

// 1. Talent: application received
const ApplicationReceived = ({ name, roleTitle, company }: { name?: string; roleTitle?: string; company?: string }) => (
  <Layout preview={`We received your application for ${roleTitle ?? 'the role'}`} title="Application received" cta="Track your application" href={`${SITE}/talent/dashboard`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>Thanks for applying for <b>{roleTitle ?? 'this role'}</b>{company ? ` with ${company}` : ''}. Our team reviews every application and matches talent on skills and profile strength.</Text>
    <Text style={text}>A complete profile and CV improves your chances. You'll hear from us by email or WhatsApp once there's an update.</Text>
  </Layout>
)

// 2. Staff: new application alert
const NewApplicationAdmin = ({ talentName, roleTitle, company }: { talentName?: string; roleTitle?: string; company?: string }) => (
  <Layout preview={`New application: ${roleTitle ?? 'role'}`} title="New application" cta="Review in admin" href={`${SITE}/admin/talent`}>
    <Text style={text}><b>{talentName ?? 'A talent'}</b> applied for <b>{roleTitle ?? 'a role'}</b>{company ? ` (${company})` : ''}.</Text>
  </Layout>
)

// 3. Talent: match status update
const STATUS_COPY: Record<string, { title: string; body: string }> = {
  approved: { title: "You've been matched to a project", body: 'Our matching system and team think you are a strong fit. Open your dashboard to accept or decline.' },
  accepted: { title: "You're selected for the project", body: 'Your project workspace is now open on your dashboard, with the group, task board and files.' },
  assessment: { title: 'Next step: assessment', body: 'You have moved to the assessment stage. Our team will share the assessment on WhatsApp shortly.' },
  interview: { title: 'Next step: interview', body: 'You have moved to the interview stage. Our team will reach out on WhatsApp to schedule it.' },
  hired: { title: "Congratulations, you're hired", body: 'You are now working on this project. Log your weekly work from your dashboard so it counts toward your pay.' },
}
const MatchUpdate = ({ name, roleTitle, company, status }: { name?: string; roleTitle?: string; company?: string; status?: string }) => {
  const c = STATUS_COPY[status ?? 'approved'] ?? STATUS_COPY.approved
  return (
    <Layout preview={c.title} title={c.title} cta="Open your dashboard" href={`${SITE}/talent/dashboard`}>
      <Text style={text}>{hi(name)}</Text>
      <Text style={text}>Project: <b>{roleTitle ?? 'Project'}</b>{company ? ` · ${company}` : ''}</Text>
      <Text style={text}>{c.body}</Text>
      <Text style={muted}>No update after two days? Message your project manager from your dashboard.</Text>
    </Layout>
  )
}

// 4. Talent: work log reviewed
const DeliverableReviewed = ({ name, title, roleTitle, status, note }: { name?: string; title?: string; roleTitle?: string; status?: string; note?: string }) => (
  <Layout preview={`Your work log was ${status === 'needs_changes' ? 'returned for changes' : 'reviewed'}`} title={status === 'needs_changes' ? 'Changes requested' : 'Work reviewed'} cta="View on your dashboard" href={`${SITE}/talent/dashboard`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>Your work log <b>{title ?? ''}</b> on <b>{roleTitle ?? 'your project'}</b> was {status === 'needs_changes' ? 'returned for changes' : 'reviewed and accepted'}.</Text>
    {note && <Text style={quote}>{note}</Text>}
  </Layout>
)

// 5. Talent: profile approved / Faculty ID
const TalentApproved = ({ name, facultyId }: { name?: string; facultyId?: string }) => (
  <Layout preview="You're now an approved Tech Faculty talent" title="You're an approved talent" cta="See open roles" href={`${SITE}/careers`}>
    <Text style={text}>{hi(name)}</Text>
    <Text style={text}>Your talent profile has been approved{facultyId ? <> and your Faculty ID is <b>{facultyId}</b></> : ''}. You can now be matched to client projects and apply to roles with one click.</Text>
  </Layout>
)

export const applicationReceived = { component: ApplicationReceived, subject: (d) => `Application received: ${d.roleTitle ?? 'your role'}`, displayName: 'Application received', previewData: { name: 'Ada Obi', roleTitle: 'Frontend Developer', company: 'Tech Faculty' } } satisfies TemplateEntry
export const newApplicationAdmin = { component: NewApplicationAdmin, subject: (d) => `New application: ${d.roleTitle ?? 'role'}`, displayName: 'New application (staff)', to: 'nachusim@gmail.com', previewData: { talentName: 'Ada Obi', roleTitle: 'Frontend Developer', company: 'Tech Faculty' } } satisfies TemplateEntry
export const matchUpdate = { component: MatchUpdate, subject: (d) => `${(STATUS_COPY[d.status] ?? STATUS_COPY.approved).title}: ${d.roleTitle ?? 'project'}`, displayName: 'Match / selection update', previewData: { name: 'Ada Obi', roleTitle: 'Tech Faculty Store', company: 'Tech Faculty', status: 'accepted' } } satisfies TemplateEntry
export const deliverableReviewed = { component: DeliverableReviewed, subject: (d) => (d.status === 'needs_changes' ? 'Changes requested on your work log' : 'Your work log was reviewed'), displayName: 'Work log reviewed', previewData: { name: 'Ada Obi', title: 'Product page UI', roleTitle: 'Tech Faculty Store', status: 'reviewed', note: 'Great work.' } } satisfies TemplateEntry
export const talentApproved = { component: TalentApproved, subject: "You're an approved Tech Faculty talent", displayName: 'Talent approved', previewData: { name: 'Ada Obi', facultyId: 'TF-WD-OL-0926-0001' } } satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '2px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333333', margin: '0 0 14px' }
const muted = { fontSize: '13px', lineHeight: '20px', color: '#777777', margin: '0 0 14px' }
const quote = { fontSize: '14px', lineHeight: '22px', color: '#333333', borderLeft: '3px solid #000000', paddingLeft: '12px', margin: '0 0 14px' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }
