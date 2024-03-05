'use client'

import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import React from 'react'
import { useRouter } from 'next/navigation'

function Footer() {
  const router = useRouter()

  return (
    <div
      className='w-full flex justify-between py-5 px-8 bg-[#0e0e0e] border-t border-[#a3a3a3]'
      id='contact'
    >
      <p className='text-base font-bricolage font-light leading-[150%] text-white tracking-wider'>
        © 2024 Votechain, All Rights Reserved.
      </p>
      <div className='flex gap-4 justify-center'>
        <TwitterOutlined
          onClick={() => router.push('/')}
          className='text-white text-2xl cursor-pointer'
        />
        <InstagramOutlined
          onClick={() => router.push('/')}
          className='text-white text-2xl cursor-pointer'
        />
        <FacebookOutlined
          onClick={() => router.push('/')}
          className='text-white text-2xl cursor-pointer'
        />
      </div>
    </div>
  )
}

export default Footer
