import React from 'react'
import { useAccount, useIsMounted } from '../../../wallet'
import { ConnectButton } from '../../atoms'
import styles from './style.module.css'

// TODO: Eliminate flash of unconnected content on loading
export function WalletData() {
  const mounted = useIsMounted()

  const { data: account } = useAccount()

  return (
    <>
      {mounted && account ? (
        <div className={styles.displayData}>
          <div className={styles.card}>{account.displayName}</div>
        </div>
      ) : (
        <ConnectButton label="Connect Wallet" />
      )}
    </>
  )
}
