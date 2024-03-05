'use client'

import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Create_election } from '@/blockchainActions/createElection'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import axios from 'axios'
import Image from 'next/image'

function Create_Election() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [FormData, setFormData] = useState({
    electionName: '',
    electionDescription: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const createElection = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { electionName, electionDescription } = FormData
    try {
      if (
        isConnected &&
        address &&
        electionName !== '' &&
        electionDescription !== ''
      ) {
        fetch('/api/election_log', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        })
          .then((response) => response.json())
          .then((data) => {
            const ok = data.message.includes('can create new election')
            const notOk =
              data.message.includes('Ongoing election found') ||
              data.message.includes('Failed to log data')
            if (ok) {
              Create_election(address, electionName, electionDescription).then(
                (response) => {
                  if (response[2].includes('Election creation failed')) {
                    toast.error(
                      'Election Creation Failed. Try After some time.'
                    )
                    setIsLoading(false)
                  }
                  response[2].includes('Create an election')
                    ? router.push('/')
                    : router.push(
                        `/election/${response[0]}/authority_dashboard`
                      )
                }
              )
            }
            if (notOk) {
              toast.error('You already have an Ongoing Election')
              setIsLoading(false)
            }
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
      if (!electionName || !electionDescription) {
        toast.error('Fill all the informations')
        setIsLoading(false)
      }
      if (!isConnected || !address) {
        toast('Please connect a wallet', {
          icon: '🔗',
        })
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  return (
    <>
      <div className='min-h-screen bg-[#0e0e0e] relative overflow-hidden'>
        <Image
          src='/nodes.webp'
          className='absolute bottom-0 -left-10'
          alt='nodes'
          width={600}
          height={600}
        />
        <Image
          src='/nodestwo.webp'
          className='absolute bottom-0 -right-10'
          alt='nodes'
          width={600}
          height={600}
        />
        <div className='w-full flex justify-center items-center'>
          <div className='mx-auto px-3 lg:px-10 rounded-2xl fixed top-3 md:top-8  shadow-md w-full md:w-5/6 z-50 bg-black flex justify-between py-4 items-center'>
            <div className='flex'>
              <p
                onClick={() => router.push('/')}
                className='text-2xl text-white font-bricolage font-medium cursor-pointer'
              >
                VOTECHAIN
              </p>
            </div>
            <div className='hidden lg:flex justify-between gap-6'>
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                connected
              </p>
            </div>
          </div>
        </div>
        <div className='w-full px-3 min-h-screen flex justify-center items-center'>
          <div className='flex flex-col px-2 lg:px-8 rounded-lg py-2 lg:py-8 gap-8 bg-black z-40 shadow-xl'>
            <div className='flex flex-col'>
              <h3 className='text-xl font-semibold leading-6 text-white/50 tracking-tighter'>
                Create Election
              </h3>
              <p className='mt-1.5 text-sm font-medium text-white/50'>
                Welcome back, Create and Manage an Election now.
              </p>
            </div>
            <div className='flex flex-col'>
              <form>
                <div>
                  <div>
                    <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                      <div className='flex justify-between'>
                        <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                          Election name
                        </label>
                        <div className='absolute right-3 translate-y-2 text-green-200'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                            className='w-6 h-6'
                          >
                            <path
                              fillRule='evenodd'
                              d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                      </div>
                      <input
                        onChange={(e) => handleChange(e, 'electionName')}
                        type='text'
                        name='electionName'
                        placeholder='Election name'
                        autoComplete='off'
                        className='block w-full text-gray-400 border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <div>
                    <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                      <div className='flex justify-between'>
                        <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                          Election Description
                        </label>
                      </div>
                      <div className='flex items-center'>
                        <textarea
                          onChange={(e) =>
                            handleChange(e, 'electionDescription')
                          }
                          row={6}
                          style={{ resize: 'none' }}
                          type='text'
                          placeholder='Election description'
                          name='electionDescription'
                          className='block text-gray-400 w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-4 flex items-center justify-center gap-x-2'>
                  <button
                    onClick={createElection}
                    className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                    type='submit'
                  >
                    {isLoading ? <LoadingOutlined /> : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='container w-full mx-auto fixed shadow-sm lg:shadow-none bg-[#e5d2ce] grid grid-cols-2 gap-2 py-4 z-40 px-3 xl:px-16'>
        <div className='flex justify-start items-center'>
          <p className=' text-[1.5rem] lg:text-[2em] font-bricolage font-bold leading-[150%] text-[#080a45] tracking-wider cursor-pointer'>
            VOTECHAIN
          </p>
        </div>
        <div className='flex gap-6 justify-end items-center'>
          <div className='gap-2 flex justify-center items-center'>
            <UserOutlined
              onClick={() =>
                toast('email@gmail.com', {
                  icon: '🤖',
                })
              }
              className='font-light text-[#080a45] font-bricolage'
            />
            <p className='hidden lg:flex font-light text-[#080a45] font-bricolage'>
              email@gmail.com
            </p>
          </div>
          <div className='flex justify-center items-center'>
            <button
              onClick={() => signOut({ callbackUrl: '/authority_signin' })}
              className='flex p-2 rounded-lg justify-center bg-red-500 items-center'
            >
              <p className='text-white font-bold'>Logout</p>
            </button>
          </div>
        </div>
      </div>
      <div className='relative grid h-screen justify-center pt-28 items-center'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0 bg-blue-500'></div>
          <div
            className='absolute inset-0 bg-green-500'
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }}
          ></div>
        </div>
        <div className='flex justify-center items-center px-3 lg:px-20'>
          {connectButton()}
        </div>
        <div className='grid justify-center max-h-screen'>
          <div className='relative w-full z-20'>
            <div className='bg-black text-white mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none'>
              <div className='flex flex-col p-6'>
                <h3 className='text-xl font-semibold leading-6 tracking-tighter'>
                  Create Election
                </h3>
                <p className='mt-1.5 text-sm font-medium text-white/50'>
                  Welcome back, Create and Manage an Election now.
                </p>
              </div>
              <div className='p-6 pt-0'>
                <form>
                  <div>
                    <div>
                      <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                        <div className='flex justify-between'>
                          <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                            Election name
                          </label>
                          <div className='absolute right-3 translate-y-2 text-green-200'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='w-6 h-6'
                            >
                              <path
                                fillRule='evenodd'
                                d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        </div>
                        <input
                          onChange={(e) => handleChange(e, 'electionName')}
                          type='text'
                          name='electionName'
                          placeholder='Election name'
                          autoComplete='off'
                          className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div>
                      <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                        <div className='flex justify-between'>
                          <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                            Election Description
                          </label>
                        </div>
                        <div className='flex items-center'>
                          <textarea
                            onChange={(e) =>
                              handleChange(e, 'electionDescription')
                            }
                            row={6}
                            style={{ resize: 'none' }}
                            type='text'
                            name='electionDescription'
                            className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-center gap-x-2'>
                    <button
                      onClick={createElection}
                      className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                      type='submit'
                    >
                      {isLoading ? <LoadingOutlined /> : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className='flex justify-center items-center pt-12'>
              <p className='font-light text-base font-bricolage text-dark-purple'>
                powered by VOTECHAIN
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Create_Election
