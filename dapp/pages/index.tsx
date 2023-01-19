import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Form } from '../components/organisms'

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
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Form />
        </div>
      </main>
    </>
  )
}

export default Home
