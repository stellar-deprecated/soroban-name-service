import React, { FunctionComponent } from 'react'
import { Card, ConnectButton } from '../../atoms'
import { useAccount } from '../../../wallet'
import { FormSearch } from '../../molecules'

const Search: FunctionComponent = () => {
  const { data: account } = useAccount()

  return (
    <Card>
      {account ? (
        <FormSearch />
      ) : (
        <ConnectButton label="Connect wallet" isHigher={true} />
      )}
    </Card>
  )
}

export { Search }
