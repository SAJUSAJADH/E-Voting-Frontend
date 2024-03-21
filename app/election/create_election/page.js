'use client'

import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Create_election } from '@/blockchainActions/createElection'
import { useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import Image from 'next/image'
import { getElectionContract } from '@/blockchainActions/getElectioncontract'

function Create_Election() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [FormData, setFormData] = useState({
    electionName: '',
    electionDescription: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const { disconnect } = useDisconnect({
    onSuccess: async () => {
      await signOut({ callbackUrl: '/' })
    },
    onError: () => {
      console.log('error', error)
      toast.error('Network Unavailable', { icon: '🚫' })
    },
  })

  const ActiveElection = async (name) => {
    const response = await fetch('/api/active_elections', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    const data = await response.json()
    return data
  }

  const connectToBlockchain = async (name) => {
    try {
      const electionContract = await getElectionContract()
      const response = await electionContract.getDeployedElection(name)
      return response
    } catch (error) {
      console.log(error)
      const response = ['', '', 'error']
      return response
    }
  }

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const createElection = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const { electionName, electionDescription } = FormData
    if (!electionName || !electionDescription) {
      toast.error('Fill all the informations')
      setIsLoading(false)
      return
    }
    if (!isConnected) {
      toast('Please connect a wallet', {
        icon: '🔗',
      })
      setIsLoading(false)
      return
    }
    try {
      if (
        isConnected &&
        session &&
        electionName !== '' &&
        electionDescription !== ''
      ) {
        const { name } = session.user
        const Data = await ActiveElection(name)
        if (Data.message === 'Already have an election') {
          setIsLoading(false)
          toast.error('You already have an Ongoing Election')
          return
        }
        Create_election(name, electionName, electionDescription).then(
          async (response) => {
            const created = response.message.includes('success')
            const notCreated = response.message.includes(
              'Election creation failed'
            )
            if (created) {
              try {
                const transactionResponse = await connectToBlockchain(name)
                if (transactionResponse[2].includes('Create an election')) {
                }
                if (transactionResponse[2].includes('error')) {
                  toast.error('Something went wrong')
                }
                if (
                  !transactionResponse[2].includes('Create an election') &&
                  !transactionResponse[2].includes('error')
                ) {
                  fetch('/api/election_log', {
                    cache: 'no-store',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name,
                      electionName,
                      electionDescription,
                      contract: transactionResponse[0],
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      const ok = data.message.includes(
                        'can create new election'
                      )
                      const notOk =
                        data.message.includes('Ongoing election found') ||
                        data.message.includes('Failed to log data')
                      if (ok) {
                        router.push(
                          `/election/${transactionResponse[0]}/authority_dashboard`
                        )
                      }
                      if (notOk) {
                        setIsLoading(false)
                        toast.error('Election creation failed. Try again')
                      }
                    })
                }
              } catch (error) {
                toast.error('Ethereum network busy.')
                setIsLoading(false)
              }
            } else if (notCreated) {
              toast.error('Election creation failed. Try again.')
              setIsLoading(false)
            } else {
              toast.error('Something went wrong. Try again.')
              setIsLoading(false)
            }
          }
        )
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
              <p
                onClick={async () => await disconnect()}
                className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'
              >
                Logout
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
                {isLoading && (
                  <div className='mt-4 flex items-center justify-center gap-x-2 my-3'>
                    <p className='text-[#a3a3a3] text-sm font-normal font-bricolage px-2 text-center'>
                      This may take some time.
                    </p>
                  </div>
                )}
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
    </>
  )
}

export default Create_Election
