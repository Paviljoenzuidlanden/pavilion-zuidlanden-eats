import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { name?: string; number?: string; occasion?: string; actionUrl?: string; validUntil?: string }
const Email = ({ name, number, occasion, actionUrl, validUntil }: Props) => (
  <Html lang="nl" dir="ltr"><Head /><Preview>Uw offerte {number} van Paviljoen Zuidlanden</Preview>
    <Body style={main}><Container style={container}>
      <Heading style={heading}>Uw offerte</Heading>
      <Text style={text}>Beste {name || 'gast'},</Text>
      <Text style={text}>Hartelijk dank voor uw aanvraag{occasion ? ` voor ${occasion}` : ''}. Hierbij ontvangt u onze offerte {number}.</Text>
      {actionUrl && <Button href={actionUrl} style={button}>Offerte bekijken en downloaden</Button>}
      {validUntil && <Text style={text}>Deze offerte is geldig tot en met {validUntil}.</Text>}
      <Text style={text}>Wilt u akkoord geven of heeft u vragen? U kunt rechtstreeks op deze e-mail antwoorden.</Text>
      <Text style={text}>Met vriendelijke groet,<br />Paviljoen Zuidlanden</Text>
    </Container></Body>
  </Html>
)
export const template = { component: Email,
  subject: (data: Record<string, any>) => `Uw offerte ${data.number || ''} — Paviljoen Zuidlanden`,
  displayName: 'Offerte voor klant', previewData: { name: 'Voorbeeldklant', number: '2026-001', occasion: 'uw bijeenkomst', actionUrl: 'https://example.com', validUntil: '16 november 2026' },
} satisfies TemplateEntry
const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const heading = { color: '#c25e3e', fontSize: '24px' }
const text = { color: '#333333', fontSize: '15px', lineHeight: '1.6' }
const button = { backgroundColor: '#c25e3e', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', margin: '12px 0' }