'use client'

import { useParams } from 'next/navigation'
import { DimensionDetail } from '@/components/life/DimensionDetail'

export default function DimensionPage() {
  const params = useParams<{ dimension: string }>()
  return <DimensionDetail dimensionId={params.dimension} />
}
