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

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '2px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#333333', margin: '0 0 10px' }
const link = { color: '#000000', textDecoration: 'underline' }
const button = { backgroundColor: '#000000', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', margin: '8px 0' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }
