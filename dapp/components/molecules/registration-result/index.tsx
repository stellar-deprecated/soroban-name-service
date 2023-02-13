import React, { FunctionComponent } from 'react'
import { TextButton } from '../../atoms'
import styles from './style.module.css'
import { Utils } from '../../../shared/utils'

interface RegistrationResultProps {
  isSuccess: boolean
  name: string
  getOwnerAddress: () => string
  getResolverAddress: () => string
  handleReset: () => void
}

const RegistrationResult: FunctionComponent<
  RegistrationResultProps
> = props => {
  return (
    <div>
      {props.isSuccess ? (
        <div className={styles.centered}>
          <p>Success! You've registered:</p>

          <p className={styles.emphasized}>
            <b>{props.name}.xlm</b>
          </p>

          <p className={styles.centeredText}>
            Owner account address:{' '}
            <b>{Utils.formatDisplayAddress(props.getOwnerAddress())}</b>
            <br />
            Resolver account address:{' '}
            <b>{Utils.formatDisplayAddress(props.getResolverAddress())}</b>
          </p>

          <TextButton
            title={'Register another name'}
            onClick={props.handleReset}
          />
        </div>
      ) : (
        <div className={styles.centered}>
          <p>Something went wrong...</p>

          <p className={styles.emphasized}>
            <b>{props.name}.xlm</b>
          </p>

          <p>was not registered :(</p>

          <TextButton title={'Try another name'} onClick={props.handleReset} />
        </div>
      )}
    </div>
  )
}

export { RegistrationResult }
