import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { sentAt?: string; by?: string }

const Email = ({ sentAt, by }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Testmelding van de website</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ padding: '24px 28px' }}>
        <Text style={{ color: '#BF6A4A', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>Paviljoen Zuidlanden</Text>
        <Heading style={{ color: '#565A3F', fontSize: '22px' }}>Testmelding geslaagd</Heading>
        <Text style={{ color: '#333', fontSize: '15px', lineHeight: '22px' }}>
          Deze testmail bevestigt dat meldingen van de website goed aankomen op dit adres.
        </Text>
        <Text style={{ color: '#777', fontSize: '13px' }}>
          Verstuurd{sentAt ? ` op ${sentAt}` : ''}{by ? ` door ${by}` : ''}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Testmelding – Paviljoen Zuidlanden',
  displayName: 'Testmelding',
  previewData: { sentAt: '10-10-2026 16:00', by: 'beheerder' },
  to: 'info@paviljoenzuidlanden.nl',
} satisfies TemplateEntry
