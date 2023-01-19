import React, { Dispatch, SetStateAction } from 'react'
import styles from './style.module.css'

export interface InputProps {
  placeHolder?: string
  setValue: Dispatch<SetStateAction<string>>
  value: string
}

export function Input({ placeHolder, setValue, value }: InputProps) {
  const handleChange = (event: {
    target: { name: string; value: string }
  }): void => {
    setValue(event.target.value)
  }

  return (
    <input
      name="input"
      placeholder={placeHolder}
      className={styles.input}
      onChange={handleChange}
      value={value}
      autoComplete="off"
    />
  )
}
