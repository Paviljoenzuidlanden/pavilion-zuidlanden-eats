import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface ShiftItem {
  date?: string
  time?: string
  note?: string
}

interface Props {
  name?: string
  shifts?: ShiftItem[]
}

const TERRACOTTA = '#BF6A4A'
const OLIVE = '#565A3F'
const CREAM = '#F6F1E9'

const Email = ({ name, shifts }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Er staat een nieuw rooster voor je klaar</Preview>
    <Body style={{ ...main, backgroundColor: CREAM }}>
      <Container style={container}>
        <Text style={brand}>Paviljoen Zuidlanden</Text>
        <Heading style={h1}>Hallo{name ? ` ${name}` : ''},</Heading>
        <Text style={text}>
          Het rooster is gepubliceerd. Dit zijn jouw diensten:
        </Text>
        <Section style={card}>
          {(shifts && shifts.length ? shifts : [{ date: '—', time: '—' }]).map((s, i) => (
            <Text key={i} style={row}>
              <strong>{s.date || '—'}</strong> · {s.time || '—'}{s.note ? ` · ${s.note}` : ''}
            </Text>
          ))}
        </Section>
        <Text style={text}>
          De actuele roosters bekijk je in de personeelsomgeving onder Rooster.
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
  subject: 'Nieuw rooster gepubliceerd',
  displayName: 'Rooster gepubliceerd',
  previewData: {
    name: 'Famke',
    shifts: [
      { date: 'donderdag 15 oktober', time: '16:00–22:00', note: 'bar' },
      { date: 'zaterdag 17 oktober', time: '12:00–23:00', note: 'keuken' },
    ],
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
const card = { backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', margin: '16px 0', border: '1px solid #e5ded2' }
const row = { ...text, margin: '4px 0' }
const hr = { borderColor: '#e5ded2', margin: '24px 0' }
const footer = { color: '#9a927f', fontSize: '12px', lineHeight: '18px' }
