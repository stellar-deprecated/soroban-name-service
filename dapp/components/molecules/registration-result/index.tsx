import React, { FunctionComponent } from 'react'
import { TextButton } from '../../atoms'
import styles from './style.module.css'

interface RegistrationResultProps {
  isSuccess: boolean
  name: string
  handleReset: () => void
}

const RegistrationResult: FunctionComponent<
  RegistrationResultProps
> = props => {
  return (
    <div>
      {props.isSuccess ? (
        <>
          <p className={styles.p}>
            <b style={{ color: '#37397a' }}>{props.name}.xlm</b> was
            successfully registered!
          </p>

          <TextButton
            title={'Register another name'}
            onClick={props.handleReset}
          />
        </>
      ) : (
        <>
          <p className={styles.p}>
            Something went wrong...{' '}
            <b style={{ color: '#37397a' }}>{props.name}.xlm</b> was not
            registered
          </p>

          <TextButton title={'Try another name'} onClick={props.handleReset} />
        </>
      )}
    </div>
  )
}

export { RegistrationResult }
