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

  const getOwnerAddress = () => customOwnerAddress || account?.address || ''
  const getResolverAddress = () =>
    customResolverAddress || account?.address || ''

  const handleLookup = async (searchTerm: string) => {
    // TODO - call lookup() with:
    // params { name: name }

    // Temporary, for demo:
    if (searchTerm === 'taken') {
      setIsNameAvailable(false)
    } else {
      setIsNameAvailable(true)
    }
  }

  const handleRegister = async () => {
    // TODO - call register() with:
    // params {
    //    ownerAddress: getOwnerAddress(),
    //    resolverAddress: getResolverAddress(),
    // }

    // Temporary, for demo:
    if (name === 'noop') {
      setIsRegisterSuccess(false)
    } else {
      setIsRegisterSuccess(true)
    }
  }

  const handleReset = () => {
    setName('')
    setIsNameAvailable(undefined)
    setCustomOwnerAddress('')
    setCustomResolverAddress('')
    setIsRegisterSuccess(undefined)
  }

  return (
    <Card>
      {account ? (
        <>
          {isNameAvailable === undefined && (
            <LookupName setName={setName} handleLookup={handleLookup} />
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
              getOwnerAddress={getOwnerAddress}
              getResolverAddress={getResolverAddress}
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
