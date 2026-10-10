import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  phone?: string
  eventTitle?: string
  eventDate?: string
  teamName?: string
  teamSize?: number
}

const TERRACOTTA = '#BF6A4A'
const OLIVE = '#565A3F'
const CREAM = '#F6F1E9'

const Email = ({ name, email, phone, eventTitle, eventDate, teamName, teamSize }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Nieuwe aanmelding voor {eventTitle || 'een activiteit'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Paviljoen Zuidlanden</Text>
        <Heading style={h1}>Nieuwe aanmelding</Heading>
        <Section style={card}>
          <Text style={row}><strong>Activiteit:</strong> {eventTitle || '—'}</Text>
          <Text style={row}><strong>Datum:</strong> {eventDate || '—'}</Text>
          <Text style={row}><strong>Naam:</strong> {name || '—'}</Text>
          <Text style={row}><strong>E-mail:</strong> {email || '—'}</Text>
          <Text style={row}><strong>Telefoon:</strong> {phone || '—'}</Text>
          {teamName ? <Text style={row}><strong>Team:</strong> {teamName} ({teamSize || '?'} personen)</Text> : null}
        </Section>
        <Text style={text}>De aanmelding staat ook in de personeelsomgeving onder Aanmeldingen.</Text>
        <Hr style={hr} />
        <Text style={footer}>Automatische notificatie van de website.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Nieuwe aanmelding${data.eventTitle ? `: ${data.eventTitle}` : ''}`,
  displayName: 'Notificatie nieuwe aanmelding',
  to: 'info@paviljoenzuidlanden.nl',
  previewData: {
    name: 'Jan Jansen',
    email: 'jan@example.com',
    phone: '06 12345678',
    eventTitle: 'Zuidlanden Pubquiz',
    eventDate: '10 Dec',
    teamName: 'De Quizmasters',
    teamSize: 4,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const brand = {
  color: OLIVE,
  fontSize: '12px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  fontWeight: 700,
  marginBottom: '24px',
}
const h1 = { color: TERRACOTTA, fontSize: '24px', marginBottom: '16px' }
const text = { color: '#3d3a33', fontSize: '15px', lineHeight: '24px' }
const card = { backgroundColor: CREAM, borderRadius: '12px', padding: '16px 20px', margin: '16px 0' }
const row = { ...text, margin: '4px 0' }
const hr = { borderColor: '#e5ded2', margin: '24px 0' }
const footer = { color: '#9a927f', fontSize: '12px' }
