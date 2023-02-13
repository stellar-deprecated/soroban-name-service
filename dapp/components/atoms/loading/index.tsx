import React from 'react'
import Image from 'next/image'
import { LoadingSvg } from '../../../assets/icons'

export interface LoadingProps {
  size: number
}

export function Loading({ size }: LoadingProps) {
  return <Image src={LoadingSvg} width={size} height={size} alt="loading..." />
}
