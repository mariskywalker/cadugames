import type { Metadata } from 'next'
import { OpeningClient } from './OpeningClient'

export const metadata: Metadata = {
  title: 'Abertura — CADU Games',
  description: 'Sala sensorial de abertura do CADU Games',
}

export default function OpeningRoute() {
  return <OpeningClient />
}
