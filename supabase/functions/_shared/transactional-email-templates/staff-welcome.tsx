import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  actionUrl?: string
}

const Email = ({ name, actionUrl }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Welkom bij het team van Paviljoen Zuidlanden — stel je wachtwoord in</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Welkom bij het team!</Heading>
        <Text style={text}>{name ? `Hoi ${name},` : 'Hoi,'}</Text>
        <Text style={text}>
          Er is een account voor je aangemaakt voor de personeelsomgeving van Paviljoen Zuidlanden.
          Klik op de knop hieronder om je eigen wachtwoord in te stellen. Daarna kun je inloggen,
          je beschikbaarheid doorgeven en je rooster bekijken.
        </Text>
        {actionUrl ? (
          <Button href={actionUrl} style={button}>Wachtwoord instellen</Button>
        ) : (
          <Text style={text}>Vraag de beheerder om een nieuwe link.</Text>
        )}
        <Text style={muted}>
          Deze link is eenmalig en een beperkte tijd geldig. Werkt hij niet meer? Vraag dan op de
          inlogpagina een nieuwe aan via "Wachtwoord vergeten".
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Welkom bij Paviljoen Zuidlanden — stel je wachtwoord in',
  displayName: 'Welkom personeel',
  previewData: { name: 'Famke', actionUrl: 'https://example.com' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 25px' }
const heading = { color: '#c25e3e', fontSize: '24px' }
const text = { color: '#333333', fontSize: '15px', lineHeight: '1.6' }
const button = {
  backgroundColor: '#c25e3e',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '15px',
  textDecoration: 'none',
  margin: '16px 0',
  display: 'inline-block',
}
const muted = { color: '#888888', fontSize: '13px', lineHeight: '1.5', marginTop: '24px' }
