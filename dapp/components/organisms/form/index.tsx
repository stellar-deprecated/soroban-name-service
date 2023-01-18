import React, { FunctionComponent, useState } from 'react'
import { Card, ConnectButton } from '../../atoms'
import { useAccount } from '../../../wallet'
import { LookupName } from '../../molecules'
import { RegisterName } from '../../molecules'
import { NameUnavailable } from '../../molecules'
import { RegistrationResult } from '../../molecules'

const Form: FunctionComponent = () => {
  const { data: account } = useAccount()

  const [name, setName] = useState<string>('')
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | undefined>()
  const [customOwnerAddress, setCustomOwnerAddress] = useState<string>('')
  const [customResolverAddress, setCustomResolverAddress] = useState<string>('')
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<
    boolean | undefined
  >()

  const handleLookup = async () => {
    // TODO - call lookup() with:
    // params { name: name }

    // Temporary, for testing:
    if (name === 'test') {
      setIsNameAvailable(true)
    } else {
      setIsNameAvailable(false)
    }
  }

  const handleRegister = async () => {
    // TODO - call register() with:
    // params {
    //    ownerAddress: (customOwnerAddress || account.address),
    //    resolverAddress: (customResolverAddress || account.address),
    // }

    // Temporary, for testing:
    // setIsRegisterSuccess(false)
    setIsRegisterSuccess(true)
  }

  const handleReset = () => {
    setName('')
    setIsNameAvailable(undefined)
    setIsRegisterSuccess(undefined)
  }

  return (
    <Card>
      {account ? (
        <>
          {isNameAvailable === undefined && (
            <LookupName
              name={name}
              setName={setName}
              handleLookup={handleLookup}
            />
          )}

          {isNameAvailable === false && (
            <NameUnavailable name={name} handleReset={handleReset} />
          )}

          {isNameAvailable === true && isRegisterSuccess === undefined && (
            <>
              <RegisterName
                name={name}
                customOwnerAddress={customOwnerAddress}
                setCustomOwnerAddress={setCustomOwnerAddress}
                customResolverAddress={customResolverAddress}
                setCustomResolverAddress={setCustomResolverAddress}
                handleRegister={handleRegister}
                handleReset={handleReset}
              />
            </>
          )}

          {isRegisterSuccess !== undefined && (
            <RegistrationResult
              isSuccess={isRegisterSuccess}
              name={name}
              handleReset={handleReset}
            />
          )}
        </>
      ) : (
        <ConnectButton label="Connect wallet" isHigher={true} />
      )}
    </Card>
  )
}

export { Form }
