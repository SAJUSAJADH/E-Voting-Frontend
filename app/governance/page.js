'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Footer } from '@/components/footer'
import Navbar from '@/components/navbar'

function Governance() {
  const [selectedPhase, setSelectedPhase] = useState('phase1')

  const phaseClass = (phase) => {
    return `${selectedPhase === phase ? 'bg-[#FFFFFF1A] border-opacity-20' : 'border-opacity-5 text-opacity-60'} border border-white px-4 py-7 cursor-pointer rounded-xl text-white font-medium font-poppins flex justify-start items-center hover:bg-[#FFFFFF1A] hover:bg-opacity-60`
  }

  const phaseDescription = (phase) => {
    return `${selectedPhase === phase ? 'grid governance' : 'hidden'} lg:col-span-2 gap-4`
  }

  return (
    <div className='bg-[#0e0e0e]'>
      <Navbar route={'governance'} />
      <div className='min-h-screen pt-40 px-3 md:px-44'>
        <div className='w-full flex flex-col gap-8 pb-16'>
          <p className='text-white text-opacity-60 text-xl md:text-2xl font-medium font-poppins'>
            GOVERNANCE
          </p>
          <p className='text-white text-2xl lg:text-3xl lg:w-1/2 font-medium font-poppins tracking-wider'>
            The Votechain Protocol is a public good{' '}
            <span className='font-black'>owned</span> and{' '}
            <span className='font-black'>governed </span> by the users
          </p>
        </div>
        <div className='grid lg:grid-cols-3 gap-6 justify-center items-center w-full pb-16 border-b border-white border-opacity-20'>
          <div className='flex justify-center lg:justify-end items-center'>
            <Image src={'/cardtwo.webp'} width={200} height={200} alt='logo' />
          </div>
          <div className='lg:col-span-2 grid gap-3 justify-center lg:justify-start text-justify'>
            <p className='text-white text-xl font-bold font-poppins'>
              Votechain Governance
            </p>
            <p className='text-white text-lg font-medium font-poppins lg:w-2/3'>
              Decentralized governance through blockchain voting systems, such
              as Votechain, empowers the community to actively participate in
              protocol decision-making, with users exercising their rights via
              an on-chain governance process.
            </p>
          </div>
        </div>
        <div className='w-full flex flex-col gap-6 pb-10 mt-28'>
          <p className='text-white text-opacity-60 text-xl md:text-2xl font-medium font-poppins'>
            THE GOVERNANCE PROCESS
          </p>
          <p className='text-white text-lg md:text-xl md:w-1/2 font-medium font-poppins tracking-wider'>
            Share your opinions and shape the future of the protocol
          </p>
          <div className='grid lg:grid-cols-3 gap-8 lg:gap-12 pt-10'>
            <div className='grid gap-4'>
              <div
                className={phaseClass('phase1')}
                onClick={() => setSelectedPhase('phase1')}
              >
                Phase 1: Authority create Election
              </div>
              <div
                className={phaseClass('phase2')}
                onClick={() => setSelectedPhase('phase2')}
              >
                Phase 2: Secure Voting process
              </div>
              <div
                className={phaseClass('phase3')}
                onClick={() => setSelectedPhase('phase3')}
              >
                Phase 3: Result Announcement
              </div>
            </div>
            <div className={phaseDescription('phase1')}>
              <p className='text-white text-2xl font-poppins font-semibold tracking-wider flex items-center'>
                Authority create Election
              </p>
              <p className='text-white text-opacity-60 text-base text-justify font-medium font-poppins lg:w-2/3'>
                Exercising their authority, the responsible entity can create
                and manage elections through a secure blockchain system,
                ensuring transparency, integrity, and community ownership in the
                voting process.
              </p>
            </div>
            <div className={phaseDescription('phase2')}>
              <p className='text-white text-2xl font-poppins font-semibold tracking-wider flex items-center'>
                Secure Voting process
              </p>
              <p className='text-white text-opacity-60 text-base text-justify font-medium font-poppins lg:w-2/3'>
                Votechain's Blockchain technology offers a secure and
                transparent voting process, with decentralized nodes that
                prevent tampering and ensure the integrity of the system. By
                creating an immutable and verifiable record of each vote,
                blockchain-based voting systems can protect against fraud and
                manipulation while enabling convenient remote voting options.
              </p>
            </div>
            <div className={phaseDescription('phase3')}>
              <p className='text-white text-2xl font-poppins font-semibold tracking-wider flex items-center'>
                Result Announcement
              </p>
              <p className='text-white text-opacity-60 text-base text-justify font-medium font-poppins lg:w-2/3'>
                After the successful completion of the voting process, the
                results can be securely and transparently announced through the
                blockchain system. The decentralized and immutable nature of the
                blockchain ensures that the results are tamper-proof and
                verifiable by all participants, enhancing trust and confidence
                in the election outcome.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Governance
