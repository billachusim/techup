import React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE = 'https://techfaculty.ng'

type Row = { label: string; count: number; path: string }

// Staff: morning digest of what is waiting in /admin
const MorningDigest = ({ rows = [] }: { rows?: Row[] }) => {
  const waiting = rows.filter((r) => r.count > 0)
  const total = waiting.reduce((n, r) => n + r.count, 0)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`${total} thing${total === 1 ? '' : 's'} waiting in Tech Faculty admin`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>TECH FACULTY</Text>
          <Heading style={h1}>Needs you today</Heading>
          {waiting.map((r) => (
            <Text key={r.label} style={text}>
              <b>{r.count}</b> {r.label.toLowerCase()} · <Link href={`${SITE}${r.path}`} style={link}>open</Link>
            </Text>
          ))}
          <Button style={button} href={`${SITE}/admin`}>Open admin</Button>
          <Hr style={hr} />
          <Text style={footer}>Sent every morning when something is waiting. Nothing waiting, no email.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const adminMorningDigest = {
  component: MorningDigest,
  subject: (d) => {
    const rows = ((d.rows as Row[] | undefined) ?? []).filter((r) => r.count > 0)
    const total = rows.reduce((n, r) => n + r.count, 0)
    return `Needs you today: ${total} waiting in Tech Faculty admin`
  },
  displayName: 'Morning digest (staff)',
  to: 'nachusim@gmail.com',
  previewData: {
    rows: [
      { label: 'New leads', count: 3, path: '/admin/leads' },
      { label: 'Payments to confirm', count: 2, path: '/admin/students' },
      { label: 'Work awaiting review', count: 5, path: '/admin/students' },
      { label: 'Talent requests', count: 0, path: '/admin/talent' },
    ],
  },
} satisfies TemplateEntry

type ReportRow = { label: string; count: number; path: string; detail?: string }

// Staff: Monday report of what was done last week and what is still waiting
const WeeklyReport = ({ done = [], todo = [] }: { done?: ReportRow[]; todo?: ReportRow[] }) => {
  const line = (r: ReportRow) => (
    <Text key={r.label} style={text}>
      <b>{r.count}</b> {r.label.toLowerCase()}
      {r.detail ? ` (${r.detail})` : ''} · <Link href={`${SITE}${r.path}`} style={link}>open</Link>
    </Text>
  )
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`Last week: ${done.length} kinds of work done, ${todo.length} still waiting`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>TECH FACULTY</Text>
          <Heading style={h1}>Weekly admin report</Heading>
          <Heading as="h2" style={h2}>Done in the last 7 days</Heading>
          {done.length ? done.map(line) : <Text style={text}>Nothing recorded this week.</Text>}
          <Heading as="h2" style={h2}>Still to do</Heading>
          {todo.length ? todo.map(line) : <Text style={text}>Nothing waiting. All clear.</Text>}
          <Button style={button} href={`${SITE}/admin`}>Open admin</Button>
          <Hr style={hr} />
          <Text style={footer}>Sent every Monday morning. Matching, Slack invites and project channels run on their own; this lists what they did and what still needs a person.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const adminWeeklyReport = {
  component: WeeklyReport,
  subject: (d) => {
    const todo = ((d.todo as ReportRow[] | undefined) ?? []).reduce((n, r) => n + r.count, 0)
    return todo ? `Weekly admin report: ${todo} item${todo === 1 ? '' : 's'} still to do` : 'Weekly admin report: all clear'
  },
  displayName: 'Weekly admin report (staff)',
  to: 'nachusim@gmail.com',
  previewData: {
    done: [
      { label: 'Talent auto-matched to roles', count: 6, path: '/admin/talent' },
      { label: 'Added to the Slack talent channel', count: 4, path: '/admin/talent' },
      { label: 'Project Slack channels created', count: 2, path: '/admin/activity' },
    ],
    todo: [
      { label: 'Open roles without a WhatsApp group link', count: 2, path: '/admin/talent', detail: 'Frontend Developer, Data Analyst' },
      { label: 'Talent profiles waiting for approval', count: 5, path: '/admin/talent' },
    ],
  },
} satisfies TemplateEntry

// Staff: an online order (Virtual SIWES, logbook service, kit) has been paid
const OrderPaidAdmin = ({ name, email, phone, school, items, amount, notes, reference }: Record<string, string | undefined>) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Paid online: ${items ?? 'an order'}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>TECH FACULTY</Text>
        <Heading style={h1}>New paid order</Heading>
        <Text style={text}><b>{items}</b> · {amount}</Text>
        <Text style={text}>{name} · {email} · WhatsApp {phone}{school ? ` · ${school}` : ''}</Text>
        {notes && <Text style={text}>{notes}</Text>}
        <Text style={text}>Flutterwave reference: {reference}</Text>
        <Button style={button} href={`${SITE}/admin/leads`}>Open paid orders</Button>
        <Hr style={hr} />
        <Text style={footer}>Mark it fulfilled on /admin/leads once the letter, pickup or kit is sorted.</Text>
      </Container>
    </Body>
  </Html>
)

export const orderPaidAdmin = {
  component: OrderPaidAdmin,
  subject: (d) => `Paid online: ${d.items ?? 'order'} (${d.amount ?? ''})`,
  displayName: 'Online order paid (staff)',
  to: 'nachusim@gmail.com',
  previewData: { name: 'Ada Obi', email: 'ada@example.com', phone: '08030000000', items: 'Virtual SIWES placement', amount: '₦45,000', reference: '1234567' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '2px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const h2 = { fontSize: '16px', fontWeight: 700, color: '#000000', margin: '20px 0 8px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333333', margin: '0 0 10px' }
const link = { color: '#000000', textDecoration: 'underline' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }
