'use client'

import Image from 'next/image'
import React from 'react'
import choice from '../../public/choice.jpg'
import { posts, navigate } from '@/utils/utilities'
import Navbar from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Blog() {
  const blogPost = posts.map((post, index) => {
    return (
      <div
        key={index}
        onClick={() => navigate(post.route)}
        className='grid mx-2 gap-3 border border-white border-opacity-20 rounded-xl mb-4 cursor-pointer hover:bg-[#FFFFFF05]'
      >
        <img src={post.image} className='rounded-t-2xl w-full' />
        <p className='text-white text-opacity-60 text-sm font-poppins font-semibold tracking-wide italic px-2'>
          {post.date}
        </p>
        <p className='text-white text-xl font-poppins pb-2 border-b border-white border-opacity-20 px-2'>
          {post.title}
        </p>
        <p className='text-white font-poppins text-base px-2'>{post.summary}</p>
      </div>
    )
  })

  return (
    <>
      <Navbar route={'blogs'} />
      <div className='bg-[#0e0e0e] min-h-screen'>
        <div className='grid gap-6 lg:relative justify-center items-center md:items-start pt-24 md:pt-40 mx-2 lg:mx-56 pb-4 md:pb-0 border-opacity-20 border-b border-white'>
          <p className='text-white leading-9 text-xl md:text-4xl font-poppins font-semibold tracking-wide md:w-3/4'>
            Updates, results, and announcements from the Votechain team.
          </p>
          <Image
            src={choice}
            width={400}
            height={350}
            className='rounded-2xl w-full md:h-2/3'
            alt='blog'
          />
          <p className='text-white xl:absolute xl:bottom-4 font-medium md:font-semibold tracking-wide font-poppins test-base md:text-2xl z-30'>
            This e-voting system addresses the challenges faced by traditional
            electronic voting systems, such as security vulnerabilities and
            maintaining trustworthiness.
          </p>
        </div>
        <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-2 pt-4 mx-2 lg:mx-56'>
          {blogPost}
        </div>
        <Footer />
      </div>
    </>
  )
}
