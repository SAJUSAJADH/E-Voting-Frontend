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
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

function Authority_Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }
  const Signup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const { email, password, confirm_password } = formData

    const isEmailFilled = email.trim() !== ''
    const isPasswordFilled = password.trim() !== ''
    const isConfirmPasswordFilled = confirm_password.trim() !== ''

    const isEmailValid = emailRegex.test(email)
    const isConfirmPasswordValid = password === confirm_password

    try {
      if (
        isEmailFilled &&
        isPasswordFilled &&
        isConfirmPasswordFilled &&
        isEmailValid &&
        isConfirmPasswordValid
      ) {
        const { data } = await axios.post('/api/authority_signup', {
          email,
          password,
        })
        const authenticate = data?.savedUser
        const userExists = (data?.message).includes('user already exists.')
        const networkError = (data?.message).includes('Try after some time')
        authenticate && router.push('/authority_signin')
        userExists && toast.error('User already exists')
        networkError && toast.error('Network error 401')
      }
      !isEmailFilled && toast.error('Invalid Email address')
      !isEmailValid && toast.error('Invalid Email address')
      !isPasswordFilled && toast.error('Please fill all fields')
      !isConfirmPasswordFilled && toast.error('Please fill all fields')
      !isConfirmPasswordValid && toast.error('Password does not match')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
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
      <section className='pt-6 lg:pt-0 min-h-screen flex items-stretch text-white '>
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
              Create Elections
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
            <h1 className='my-6 text-[1.2rem] lg:text-[2em] font-bricolage font-bold leading-[150%] text-white tracking-wider cursor-pointer'>
              CREATE ACCOUNT
            </h1>
            <div className='pt-1 pb-6 space-x-2'>
              <span
                onClick={() => {
                  toast.error('Under development')
                }}
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
                onClick={() => {
                  toast.error('Under development')
                }}
                className='w-10 hover:text-[#737373] h-10 bg-black items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white cursor-pointer'
              >
                <TwitterOutlined />
              </span>
            </div>
            <p className='text-white'>or use your email account</p>
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
              <div className='pb-2 pt-4'>
                <input
                  onChange={(e) => handleChange(e, 'confirm_password')}
                  className='block w-full p-4 text-lg rounded-lg bg-white text-[#737373] outline-none'
                  type='password'
                  name='confirm_password'
                  id='confirm_password'
                  placeholder='Confirm Password'
                />
              </div>
              <div className='text-right'>
                <a
                  className='text-gray-400 hover:text-white'
                  href='/authority_signin'
                >
                  already have an account?
                </a>
              </div>
              <div className='px-4 pb-2 pt-4'>
                <button
                  disabled={isLoading}
                  onClick={Signup}
                  className='uppercase block w-full p-4 text-lg rounded-full bg-[#81fbe9] box-shadow text-black focus:outline-none'
                >
                  {isLoading ? <LoadingOutlined /> : 'SIGN UP'}
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

export default Authority_Signup
