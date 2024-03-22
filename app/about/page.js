'use client'

import Image from 'next/image'
import React from 'react'
import {
  ExclamationCircleOutlined,
  FileDoneOutlined,
  GithubOutlined,
} from '@ant-design/icons'
import { navigate } from '@/utils/utilities'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/footer'
import Navbar from '@/components/navbar'

function Developers() {
  const router = useRouter()
  const styles = {
    cardClasses:
      'border border-white border-opacity-20 rounded-2xl px-4 py-6 grid gap-5 justify-start hover:bg-[#FFFFFF05] cursor-pointer',
    cardTitle: 'text-white text-lg font-poppins font-semibold tracking-wider',
    cardDescription:
      'text-white text-base text-opacity-60 font-poppins font-medium tracking-wider',
    Iconstyle: 'text-white font-medium text-2xl flex justify-start',
  }
  const smartContract =
    'https://sepolia.etherscan.io/address/0x778109394f5a076215f0af541311c3a660c21cbe#code'

  return (
    <div className='bg-[#0e0e0e]'>
      <Navbar route={'about'} />
      <div className='min-h-screen pt-40 px-3 md:px-44'>
        <div className='w-full flex flex-col gap-8 pb-16 border-b border-white border-opacity-20'>
          <p className='text-white text-opacity-60 text-xl md:text-2xl font-medium font-poppins'>
            ABOUT
          </p>
          <div className='w-full h-56 lg:h-80 relative rounded-2xl'>
            <Image
              src={'/about.webp'}
              fill
              style={{ objectFit: 'cover' }}
              alt='dev'
              className='w-full rounded-2xl'
            />
            <div className='absolute flex flex-col gap-4 ml-8 bottom-4 lg:w-1/2'>
              <p className='text-white text-lg lg:text-xl font-semibold tracking-wider font-poppins'>
                Vote with the Votechain Protocol.
              </p>
              <p className='text-white text-base lg:text-lg font-medium tracking-wider font-poppins'>
                Dive into the world of E-Voting, Election, and results built on
                top of the Votechain Protocol.
              </p>
            </div>
          </div>
          <div className='grid lg:grid-cols-3 gap-4 pt-10'>
            <div
              className={styles.cardClasses}
              onClick={() => router.push('/faq')}
            >
              <ExclamationCircleOutlined className={styles.Iconstyle} />
              <p className={styles.cardTitle}>What is Votechain?</p>
              <p className={styles.cardDescription}>
                Learn about the Votechain Protocol’s core concepts: Elections,
                Voting, Result Announcement, and more.
              </p>
            </div>
            <div
              className={styles.cardClasses}
              onClick={() => navigate(smartContract)}
            >
              <FileDoneOutlined className={styles.Iconstyle} />
              <p className={styles.cardTitle}>Smart contracts overview</p>
              <p className={styles.cardDescription}>
                Review the architecture of the Votechain Protocol smart
                contracts, made up of the Core and Periphery libraries.
              </p>
            </div>
            <div
              className={styles.cardClasses}
              onClick={() => navigate('https://github.com')}
            >
              <GithubOutlined className={styles.Iconstyle} />
              <p className={styles.cardTitle}>Github</p>
              <p className={styles.cardDescription}>
                Want to make any change in the world! Make your contribution to
                Votechain Community.
              </p>
            </div>
          </div>
        </div>
        <div className='grid lg:grid-cols-2 gap-8 py-16'>
          <div className='flex flex-col gap-4 items-center'>
            <p className='text-white text-xl font-poppins font-medium'>
              Why we want to use Votechain ?
            </p>
            <p className='text-white text-base text-opacity-60 font-poppins font-medium'>
              By utilizing blockchain technology, our e-voting system offers
              enhanced security, transparency, and trustworthiness. Our system's
              decentralized and immutable nature ensures secure and
              tamper-resistant voting records, while cryptographic algorithms
              protect the integrity and privacy of votes.
            </p>
          </div>
          <div className='flex lg:justify-center'>
            <Image src={'/shield.webp'} width={280} height={280} alt='Next' />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Developers
