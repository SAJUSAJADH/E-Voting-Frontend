import { Footer } from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

function FAQ() {
  return (
    <div className='bg-[#0e0e0e]'>
      <Navbar route={'faq'} />
      <div className='min-h-screen pt-40 px-3 md:px-44'>
        <div className='w-full flex'>
          <p className='text-white text-xl md:text-2xl font-semibold tracking-wider font-poppins'>
            Frequently Asked Questions
          </p>
        </div>
        <div className='w-full flex flex-col gap-5 border-white border-b border-opacity-20 py-16'>
          <p className='text-white text-lg md:text-xl font-semibold tracking-wider font-poppins'>
            What is Votechain?
          </p>
          <p className='text-white text-base md:text-lg font-medium text-opacity-60 tracking-wider font-poppins'>
            Votechain is a blockchain-based e-voting system that aims to enhance
            the security, transparency, and trustworthiness of electronic
            voting.
          </p>
        </div>
        <div className='w-full flex flex-col gap-5 border-white border-b border-opacity-20 py-16'>
          <p className='text-white text-lg md:text-xl font-semibold tracking-wider font-poppins'>
            How does Votechain work?
          </p>
          <p className='text-white text-base md:text-lg font-medium text-opacity-60 tracking-wider font-poppins'>
            Votechain is a decentralized and immutable system that uses
            blockchain technology to ensure secure and tamper-resistant voting
            records. Cryptographic algorithms protect the integrity and privacy
            of votes.
          </p>
          <p className='text-white text-base md:text-lg font-medium text-opacity-60 tracking-wider font-poppins'>
            Transparent and auditable record-keeping enables stakeholders to
            trace and verify each transaction.
          </p>
        </div>
        <div className='w-full flex flex-col gap-5 py-16'>
          <p className='text-white text-lg md:text-xl font-semibold tracking-wider font-poppins'>
            How do I use Votechain?
          </p>
          <p className='text-white text-base md:text-lg font-medium text-opacity-60 tracking-wider font-poppins'>
            To use Votechain, you need to connect to the system using a Web3
            wallet. Once connected, you can create a new voting event, submit
            your vote, or monitor the voting process in real-time.
          </p>
        </div>
        <div className='w-full flex flex-col gap-5 border-white border-b border-opacity-20 py-16'>
          <p className='text-white text-lg md:text-xl font-semibold tracking-wider font-poppins'>
            How is my vote managed and secured?
          </p>
          <p className='text-white text-base md:text-lg font-medium text-opacity-60 tracking-wider font-poppins'>
            Votechain uses cryptographic techniques to secure each vote and
            ensure that it cannot be tampered with or altered. The system's
            decentralized and immutable nature also ensures that voting records
            are secure and transparent.
          </p>
        </div>
        <div className='w-full flex flex-col gap-5 border-white border-b border-opacity-20 py-16'>
          <p className='text-white text-lg md:text-xl font-semibold tracking-wider font-poppins'>
            What are the benefits of using Votechain over traditional
            paper-based voting systems?
          </p>
          <p className='text-white text-base md:text-lg font-medium text-opacity-60 tracking-wider font-poppins'>
            Votechain offers several advantages over traditional paper-based
            voting systems, including enhanced security, transparency, and
            trustworthiness. The system also offers faster and more efficient
            voting processes, reducing the time and cost required for elections
            and other types of voting processes.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FAQ
