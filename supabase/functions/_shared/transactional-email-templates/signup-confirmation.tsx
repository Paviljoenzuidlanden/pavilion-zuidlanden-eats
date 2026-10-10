import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  eventTitle?: string
  eventDate?: string
  teamName?: string
  teamSize?: number
}

const TERRACOTTA = '#BF6A4A'
const OLIVE = '#565A3F'
const CREAM = '#F6F1E9'

const Email = ({ name, eventTitle, eventDate, teamName, teamSize }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Bevestiging van je aanmelding voor {eventTitle || 'de activiteit'}</Preview>
    <Body style={{ ...main, backgroundColor: CREAM }}>
      <Container style={container}>
        <Text style={brand}>Paviljoen Zuidlanden</Text>
        <Heading style={h1}>Bedankt{name ? `, ${name}` : ''}!</Heading>
        <Text style={text}>
          We hebben je aanmelding ontvangen voor <strong>{eventTitle || 'de activiteit'}</strong>
          {eventDate ? ` op ${eventDate}` : ''}.
        </Text>
        {teamName ? (
          <Section style={card}>
            <Text style={cardText}><strong>Team:</strong> {teamName}</Text>
            {teamSize ? <Text style={cardText}><strong>Personen:</strong> {teamSize}</Text> : null}
          </Section>
        ) : null}
        <Text style={text}>
          Je ontvangt binnenkort een bevestiging van je aanmelding. Tot dan in het paviljoen!
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Paviljoen Zuidlanden · It Boumantsje 4, 8941 CR Leeuwarden
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Bevestiging aanmelding${data.eventTitle ? `: ${data.eventTitle}` : ''}`,
  displayName: 'Bevestiging agenda-aanmelding',
  previewData: {
    name: 'Jan',
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
const h1 = { color: TERRACOTTA, fontSize: '26px', marginBottom: '16px' }
const text = { color: '#3d3a33', fontSize: '15px', lineHeight: '24px' }
const card = { backgroundColor: CREAM, borderRadius: '12px', padding: '16px 20px', margin: '16px 0' }
const cardText = { ...text, margin: '4px 0' }
const hr = { borderColor: '#e5ded2', margin: '24px 0' }
const footer = { color: '#9a927f', fontSize: '12px', lineHeight: '18px' }
