import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Search } from '../components/organisms'
import { WalletData } from '../components/molecules'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SNS - Soroban Name Service</title>
        <meta name="description" content="Soroban Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h3>Soroban Name Service</h3>
        <WalletData />
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Search />
        </div>
      </main>
    </>
  )
}

export default Home
