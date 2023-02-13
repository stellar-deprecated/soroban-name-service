import React from 'react'
import styles from './style.module.css'

export interface InputLabelProps {
  text: string
}

export function InputLabel({ text }: InputLabelProps) {
  return <h6 className={styles.inputLabel}>{text}</h6>
}
