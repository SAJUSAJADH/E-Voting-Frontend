'use client'

import {
  FacebookOutlined,
  GithubOutlined,
  GoogleOutlined,
  InstagramOutlined,
  LoadingOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { getElectionContract } from '@/blockchainActions/getElectioncontract'
import Image from 'next/image'

function Authority_Signin() {
  const router = useRouter()
  const session = useSession()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }
  const Signin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const { email, password } = formData

    try {
      await signIn('credentials', { email, password, redirect: false }).then(
        async ({ ok, error }) => {
          if (ok) {
            const electionContract = await getElectionContract()
            const response = await electionContract.getDeployedElection(email)
            response[2].includes('Create an election')
              ? router.push('/election/create_election')
              : router.push(`/election/${response[0]}/authority_dashboard`)
          } else {
            // console.log(error)
            toast.error('incorrect email or password')
            setIsLoading(false)
          }
        }
      )
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  return (
    <>
      <div className='flex justify-start items-start px-3 lg:px-12 py-4 bg-[#0e0e0e] w-full lg:w-1/2 fixed z-50'>
        <p
          onClick={() => router.push('/')}
          className='text-[2em] font-bricolage font-bold leading-[150%] text-white tracking-wider cursor-pointer'
        >
          VOTECHAIN
        </p>
      </div>
      <section className='min-h-screen flex items-stretch text-white '>
        <div className='lg:flex w-1/2 hidden text-white bg-[#0e0e0e] bg-no-repeat bg-cover relative items-center overflow-hidden'>
          <Image
            src='/crystalthree.webp'
            className='absolute z-30 rotate-45 -bottom-20 -left-20'
            alt='crystal'
            width={400}
            height={400}
          />
          <div className='w-full px-24 z-10'>
            <h1 className='text-5xl font-bold text-left tracking-wide'>
              Manage Elections
            </h1>
            <p className='text-xl text-[#737373] my-4'>
              Conduct and Manage Fair Elections that Leverages the Blockchain
              Technology.
            </p>
          </div>
          <div className='bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4'>
            <span>
              <TwitterOutlined className='text-white text-2xl cursor-pointer' />
            </span>
            <span>
              <InstagramOutlined className='text-white text-2xl cursor-pointer' />
            </span>
            <span>
              <FacebookOutlined className='text-white text-2xl cursor-pointer' />
            </span>
          </div>
        </div>
        <div className='lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#0e0e0e]'>
          <div className='absolute lg:hidden z-10 inset-0 text-white bg-[#0e0e0e] bg-no-repeat bg-cover items-center'></div>
          <div className='w-full z-20'>
            <h1 className='my-6 text-[1.5rem] lg:text-[2em] font-bricolage font-bold leading-[150%] text-white tracking-wider cursor-pointer'>
              SIGN IN
            </h1>
            <div className='pt-1 pb-6 space-x-2'>
              <span
                onClick={() => toast.error('Under development')}
                className='w-10 hover:text-[#737373] h-10 bg-black items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white cursor-pointer'
              >
                <GithubOutlined />
              </span>
              <button
                type='button'
                onClick={() => toast.error('Under development')}
                className='w-10 hover:text-[#737373] h-10 bg-black items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white cursor-pointer'
              >
                <GoogleOutlined />
              </button>
              <span
                onClick={() => toast.error('Under development')}
                className='w-10 hover:text-[#737373] h-10 bg-black items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white cursor-pointer'
              >
                <TwitterOutlined />
              </span>
            </div>
            <p className='text-black'>or use your email account</p>
            <form className='sm:w-2/3 w-full px-4 lg:px-0 mx-auto'>
              <div className='pb-2 pt-4'>
                <input
                  onChange={(e) => handleChange(e, 'email')}
                  type='email'
                  name='email'
                  id='email'
                  placeholder='Email'
                  className='block w-full p-4 text-lg rounded-lg bg-white text-[#737373] outline-none'
                />
              </div>
              <div className='pb-2 pt-4'>
                <input
                  onChange={(e) => handleChange(e, 'password')}
                  className='block w-full p-4 text-lg rounded-lg bg-white text-[#737373] outline-none'
                  type='password'
                  name='password'
                  id='password'
                  placeholder='Password'
                />
              </div>
              <div className='text-center text-sm lg:text-base flex justify-between gap-2 py-2'>
                <a
                  className='text-gray-400 hover:text-white'
                  href='/authority_signup'
                >
                  don't have an account?
                </a>
                <a className='text-gray-400 hover:text-white' href='#'>
                  Forgot your password?
                </a>
              </div>
              <div className='px-4 pb-2 pt-4'>
                <button
                  disabled={isLoading}
                  onClick={Signin}
                  className='uppercase block w-full p-4 text-lg rounded-full bg-[#81fbe9] box-shadow text-black focus:outline-none'
                >
                  {isLoading ? <LoadingOutlined /> : 'sign in'}
                </button>
              </div>
              <div className='p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden '>
                <a href='#' className=''>
                  <TwitterOutlined className='text-white text-2xl cursor-pointer' />
                </a>
                <a href='#' className=''>
                  <InstagramOutlined className='text-white text-2xl cursor-pointer' />
                </a>
                <a href='#' className=''>
                  <FacebookOutlined className='text-white text-2xl cursor-pointer' />
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Authority_Signin
