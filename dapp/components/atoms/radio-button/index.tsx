import React from 'react'
import styles from './style.module.css'

export interface RadioButtonProps {
  title: string
  isSelected: boolean
  setValue: () => void
}

export function RadioButton({ title, isSelected, setValue }: RadioButtonProps) {
  return (
    <div className={styles.radioButton} onClick={setValue}>
      <div className={styles.bubbleOuter}>
        {isSelected && <div className={styles.bubbleInner} />}
      </div>

      <span>{title}</span>
    </div>
  )
}
