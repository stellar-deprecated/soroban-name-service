import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react'
import {
  Button,
  Input,
  InputLabel,
  RadioButton,
  Spacer,
  TextButton,
} from '../../atoms'
import { useAccount } from '../../../wallet'
import styles from './style.module.css'

interface RegisterNameProps {
  name: string
  customOwnerAddress: string
  setCustomOwnerAddress: Dispatch<SetStateAction<string>>
  customResolverAddress: string
  setCustomResolverAddress: Dispatch<SetStateAction<string>>
  handleRegister: () => void
  handleReset: () => void
}

const RegisterName: FunctionComponent<RegisterNameProps> = props => {
  const { data: account } = useAccount()

  const [useCustomOwnerAddress, setUseCustomOwnerAddress] =
    useState<boolean>(false)
  const [useCustomResolverAddress, setUseCustomResolverAddress] =
    useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    setIsSubmitting(true)
    await props.handleRegister()
    setIsSubmitting(false)
  }

  return (
    <div>
      <p className={styles.p}>
        <b style={{ color: '#37397a' }}>{props.name}.xlm</b> is available!
      </p>

      <Spacer rem={1} />

      <InputLabel text={'Label owner account address'} />
      {account && (
        <RadioButton
          title={`Use your address - ${account.displayName}`}
          isSelected={useCustomOwnerAddress === false}
          setValue={() => {
            props.setCustomOwnerAddress('')
            setUseCustomOwnerAddress(false)
          }}
        ></RadioButton>
      )}
      <RadioButton
        title={'Enter an address'}
        isSelected={useCustomOwnerAddress === true}
        setValue={() => setUseCustomOwnerAddress(true)}
      ></RadioButton>
      {useCustomOwnerAddress && (
        <Input
          setValue={props.setCustomOwnerAddress}
          value={props.customOwnerAddress}
        />
      )}

      <Spacer rem={1} />

      <InputLabel text={'Resolver account address'} />
      {account && (
        <RadioButton
          title={`Use your address - ${account.displayName}`}
          isSelected={useCustomResolverAddress === false}
          setValue={() => {
            props.setCustomResolverAddress('')
            setUseCustomResolverAddress(false)
          }}
        ></RadioButton>
      )}
      <RadioButton
        title={'Enter an address'}
        isSelected={useCustomResolverAddress === true}
        setValue={() => setUseCustomResolverAddress(true)}
      ></RadioButton>
      {useCustomResolverAddress && (
        <Input
          setValue={props.setCustomResolverAddress}
          value={props.customResolverAddress}
        />
      )}

      <Spacer rem={1} />

      <Button
        title={'Register'}
        onClick={submit}
        disabled={!account || isSubmitting}
        isLoading={isSubmitting}
      />

      <TextButton title={'Try another name'} onClick={props.handleReset} />
    </div>
  )
}

export { RegisterName }
