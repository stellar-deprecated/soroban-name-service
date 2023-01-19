import React from 'react'
import styles from './style.module.css'

export interface TextButtonProps {
  title: string
  onClick: () => void
}

export function TextButton({ title, onClick }: TextButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {title}
    </button>
  )
}
