import VoterNavbar from '@/components/voterNavbar'
import React from 'react'

function Dashboard() {
  return (
    <>
      <VoterNavbar route={'dashboard'} />
      <div className='w-full bg-[#353935] pt-28 lg:pt-36 px-3 lg:px-20 min-h-screen grid justify-start items-start pb-8 lg:pb-0'></div>
    </>
  )
}

export default Dashboard
