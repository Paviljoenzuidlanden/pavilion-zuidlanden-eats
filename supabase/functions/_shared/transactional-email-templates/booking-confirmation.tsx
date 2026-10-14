import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  occasion?: string
  guests?: string | number
  date?: string
}

const TERRACOTTA = '#BF6A4A'
const OLIVE = '#565A3F'
const CREAM = '#F6F1E9'

const Email = ({ name, occasion, guests, date }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>We hebben je aanvraag ontvangen</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Paviljoen Zuidlanden</Text>
        <Heading style={h1}>Bedankt{name ? `, ${name}` : ''}!</Heading>
        <Text style={text}>
          We hebben je aanvraag goed ontvangen. We nemen zo snel mogelijk contact met je op om alles door te spreken en je een voorstel te sturen.
        </Text>
        <Section style={card}>
          <Text style={row}><strong>Gelegenheid:</strong> {occasion || '—'}</Text>
          <Text style={row}><strong>Aantal gasten:</strong> {guests || '—'}</Text>
          <Text style={row}><strong>Gewenste datum:</strong> {date || '—'}</Text>
        </Section>
        <Text style={text}>Vragen? Mail ons gerust via info@paviljoenzuidlanden.nl.</Text>
        <Hr style={hr} />
        <Text style={footer}>Paviljoen Zuidlanden · It Boumantsje 4, 8941 CR Leeuwarden</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'We hebben je aanvraag ontvangen – Paviljoen Zuidlanden',
  displayName: 'Bevestiging feestaanvraag',
  previewData: { name: 'Marie', occasion: 'Verjaardagsfeest', guests: 40, date: '2026-11-21' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const brand = { color: OLIVE, fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, fontWeight: 700, marginBottom: '24px' }
const h1 = { color: TERRACOTTA, fontSize: '24px', marginBottom: '16px' }
const text = { color: '#3d3a33', fontSize: '15px', lineHeight: '24px' }
const card = { backgroundColor: CREAM, borderRadius: '12px', padding: '16px 20px', margin: '16px 0' }
const row = { ...text, margin: '4px 0' }
const hr = { borderColor: '#e5ded2', margin: '24px 0' }
const footer = { color: '#9a927f', fontSize: '12px' }
