'use client'

import { Footer } from '@/components/footer'
import Navbar from '@/components/navbar'
import {
  DashboardOutlined,
  LoadingOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useSignMessage, useNetwork, useDisconnect } from 'wagmi'
import { getElectionContract } from '@/blockchainActions/getElectioncontract'
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import toast from 'react-hot-toast'

export default function Home() {
  const router = useRouter()
  const { address, isConnected, isConnecting } = useAccount()
  const { data: session, status } = useSession()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect({
    onSettled(data, error) {
      console.log('Settled', { data, error })
    },
  })
  const [userType, setUserType] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const connectToBlockchain = async () => {
    try {
      const electionContract = await getElectionContract()
      const response = await electionContract.getDeployedElection(address)
      return response
    } catch (error) {
      console.log(error)
      const response = ['', '', 'error']
      return response
    }
  }

  const Authenticate_Authority = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to Votechain.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      signIn('credentials', {
        message: JSON.stringify(message),
        signature,
        type: userType,
        redirect: false,
      }).then(async ({ ok, error }) => {
        if (error) {
          toast.error('Something went wrong.')
        }
        if (ok) {
          if (session) {
            const { user } = session
            if (user.role === 'authority') {
              const response = await connectToBlockchain()
              response[2].includes('Create an election') &&
                router.push('/election/create_election')
              response[2].includes('error') &&
                toast.error('Something went wrong')
              if (
                !response[2].includes('Create an election') &&
                !response[2].includes('error')
              ) {
                router.push(`/election/${response[0]}/authority_dashboard`)
              }
            }
          }
        }
      })
    } catch (error) {
      console.log(error)
      await disconnect()
    }
  }

  useEffect(() => {
    if (isConnected && status === 'unauthenticated') {
      Authenticate_Authority()
    }
  }, [isConnected, status, session])

  const authorityErrorstyles =
    'bg-[#262626] hover:bg-[#404040] bg-opacity-60 px-10 text-white flex justify-center py-3 rounded items-center gap-3'
  const voterErrorStyles =
    'bg-[#81fbe9] box-shadow px-10 text-black flex justify-center py-3 rounded items-center gap-3'

  const customConnectbutton = (errorStyles, tag) => {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated')

          if (
            connected &&
            isConnected &&
            status === 'authenticated' &&
            session
          ) {
            const { user } = session
            if (tag === 'authority' && user.role === 'authority') {
              return (
                <button
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true)
                    const response = await connectToBlockchain()
                    if (response[2].includes('Create an election')) {
                      router.push('/election/create_election')
                    }

                    if (response[2].includes('error')) {
                      setIsLoading(false)
                      toast.error('Something went wrong')
                    }

                    if (
                      !response[2].includes('Create an election') &&
                      !response[2].includes('error')
                    ) {
                      router.push(
                        `/election/${response[0]}/authority_dashboard`
                      )
                    }
                  }}
                  className='bg-[#262626] hover:bg-[#404040] px-10 text-white flex justify-center py-3 rounded items-center gap-3'
                  type='button'
                >
                  Dashboard{' '}
                  {isLoading ? <LoadingOutlined /> : <DashboardOutlined />}
                </button>
              )
            } else if (tag === 'voter' && user.role === 'voter') {
              return (
                <button
                  disabled={isLoading}
                  onClick={() => {
                    const { name } = user
                    setIsLoading(true)
                    fetch('/api/voter_validation', {
                      cache: 'no-store',
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ name }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        const ok = (data?.message).includes('Voter found')
                        const notOk = (data?.message).includes('not found')
                        const networkError =
                          (data?.message).includes('Network busy')
                        if (ok) {
                          router.push(`/voter/${name}/dashboard`)
                        }
                        if (notOk) {
                          router.push(`/voter/${name}/profile_setup`)
                        }
                        if (networkError) {
                          setIsLoading(false)
                          toast.error('Network Unavailable', { icon: '🚫' })
                        }
                      })
                  }}
                  className='bg-[#81fbe9] box-shadow px-10 text-black flex justify-center py-3 rounded items-center gap-3'
                  type='button'
                >
                  Dashboard{' '}
                  {isLoading ? <LoadingOutlined /> : <DashboardOutlined />}
                </button>
              )
            }
          }

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  if (tag === 'authority') {
                    return (
                      <button
                        onClick={() => {
                          setUserType(tag)
                          openConnectModal()
                        }}
                        className='bg-[#262626] hover:bg-[#404040] px-10 text-white flex justify-center py-3 rounded items-center gap-3'
                        type='button'
                      >
                        Authority <UserOutlined />
                      </button>
                    )
                  } else if (tag === 'voter') {
                    return (
                      <button
                        onClick={() => {
                          setUserType(tag)
                          openConnectModal()
                        }}
                        className='bg-[#81fbe9] box-shadow px-14 text-black flex justify-center py-3 rounded items-center gap-3'
                        type='button'
                      >
                        Voter <UsergroupAddOutlined />{' '}
                      </button>
                    )
                  }
                }

                if (chain.unsupported) {
                  openChainModal()
                  return (
                    <button
                      onClick={openChainModal}
                      className={errorStyles}
                      type='button'
                    >
                      Wrong network
                    </button>
                  )
                }
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    )
  }

  return (
    <>
      <div className='bg-[#0e0e0e] min-h-screen z-0'>
        <Navbar route={'home'} />
        <div className='w-full min-h-screen flex flex-col gap-16 justify-center items-center relative overflow-hidden'>
          <div className='lg:w-2/3 px-3 lg:px-0 -mt-16 lg:mt-0 text-center flex flex-col gap-4 justify-center items-center z-20'>
            <p className='text-white text-3xl lg:text-4xl xl:text-6xl font-bricolage font-medium'>
              Secure and Transparent Electronic Voting
            </p>
            <p className='px-4 lg:px-3 font-bricolage text-center lg:text-center text-base lg:text-xl text-[#737373]'>
              Utilizes blockchain technology to ensure secure and transparent
              voting process. Enables voters to cast their votes electronically,
              eliminating the need for paper ballots
            </p>
            <div className='grid lg:flex justify-around gap-6 items-center'>
              {customConnectbutton(authorityErrorstyles, 'authority')}
              {customConnectbutton(voterErrorStyles, 'voter')}
            </div>
          </div>
          <Image
            className='absolute -bottom-16 brightness-50 rotate-180 -left-32 w-auto h-auto z-10'
            src='/backgroundone.webp'
            alt='bg1formula'
            width={350}
            height={350}
          />
          <Image
            className='absolute -bottom-16 brightness-50 -rotate-[60deg] -right-64 w-auto h-auto z-10'
            src='/backgroundtwo.webp'
            alt='bg2formula'
            width={600}
            height={600}
          />
        </div>
      </div>
      <div id='about' className='bg-[#0e0e0e] pt-4 lg:pt-16'>
        <div className='px-3 lg:px-32 py-4 justify-center'>
          <div className='grid gap-1 lg:grid-cols-3 -mt-1'>
            <div className='grid gap-2'>
              <div className='grid md:flex bg-[#262626] rounded-xl justify-center text-center md:text-start md:justify-between px-3 lg:px-6 py-8 items-center'>
                <p className='text-[#737373] font-medium font-bricolage text-base'>
                  Blockchain based security
                </p>
                <p className='text-[2rem] text-[#23f7dd]'>~ 100%</p>
              </div>
              <div className='grid md:flex bg-[#262626] rounded-xl justify-center text-center md:text-start md:justify-between px-3 lg:px-6 py-8 items-center'>
                <p className='text-[#737373] font-medium font-bricolage text-base'>
                  Transparent voting process
                </p>
                <p className='text-[2rem] text-[#23f7dd]'>~ 101%</p>
              </div>
            </div>
            <div className='relative h-[276px] md:flex bg-[#262626] rounded-xl justify-center text-center md:text-start md:justify-between px-3 lg:px-6 py-6 items-center'>
              <Image
                src='/cardOne.webp'
                alt='card1formula'
                fill
                className='bg-cover'
              />
              <p className='text-[#737373] font-medium font-bricolage text-base'>
                Validator Nodes
              </p>
              <p className='text-[2rem] text-[#23f7dd] md:absolute md:bottom-3 md:right-3'>
                ETHEREUM
              </p>
            </div>
            <div className='grid justify-center bg-[#262626] rounded-xl px-3 lg:px-6 py-6 items-center'>
              <Image
                src='/cardtwo.webp'
                alt='card2formula'
                width={200}
                height={300}
                className='right-0 spin-animation duration-100'
              />
              <p className='text-[#4ade80] font-medium font-bricolage text-center text-xl z-20'>
                Global Access
              </p>
            </div>
          </div>
          <div
            className='pt-16 flex flex-col gap-8 justify-between items-center'
            id='benifits'
          >
            <div className='background-green bg-transparent w-24 flex justify-center items-center px-3 py-1 rounded-full'>
              <p className='text-white font-normal font-bricolage text-base'>
                Features
              </p>
            </div>
            <div className='flex justify-center items-center px-3 lg:px-20'>
              <p className='text-white font-medium font-bricolage text-2xl md:text-3xl lg:text-4xl xl:text-6xl text-center'>
                Key Features of our Electronic Voting System
              </p>
            </div>
            <div className='flex justify-center items-center px-3 lg:px-20'>
              <p className='text-[#737373] font-normal font-bricolage text-base lg:text-xl text-center'>
                votechain adds many additonal features to the existing system
                for electronic voting.
              </p>
            </div>
            <div className='grid lg:grid-cols-4 gap-4 w-full'>
              <div className='grid gap-16 h-[340px] bg-[#262626] rounded-xl px-3 overflow-hidden'>
                <div className='relative -mt-16'>
                  <Image
                    src='/block.webp'
                    className='absolute top-0 left-5'
                    alt=''
                    width={260}
                    height={260}
                  />
                </div>
                <div className='flex justify-center items-end py-6'>
                  <p className='text-[#f5f5f5] text-2xl'>Blockchain Security</p>
                </div>
              </div>
              <div className='grid gap-16 h-[340px] bg-[#262626] rounded-xl px-3 overflow-hidden'>
                <div className='flex justify-center items-start py-6'>
                  <p className='text-[#f5f5f5] text-2xl'>
                    Secure and Immutable
                  </p>
                </div>
                <div className='relative -mb-16'>
                  <Image
                    src='/shield.webp'
                    className='absolute bottom-0 left-5'
                    alt=''
                    width={260}
                    height={260}
                  />
                </div>
              </div>
              <div className='lg:col-span-2 grid gap-16 h-[340px] bg-[#262626] rounded-xl px-3 overflow-hidden'>
                <div className='relative -mt-16'>
                  <Image
                    src='/chain.png'
                    className='absolute top-0 right-0'
                    alt=''
                    width={500}
                    height={500}
                  />
                </div>
                <div className='grid lg:flex justify-center items-center py-6'>
                  <p className='text-[#f5f5f5] text-center text-2xl'>
                    Transparent voting process
                  </p>
                  <p className='text-[#737373] text-center text-base'>
                    Blockchain enables 100% transparent voting process
                  </p>
                </div>
              </div>
              <div className='grid gap-16 h-[340px] bg-[#262626] rounded-xl  overflow-hidden'>
                <div className='relative -mt-16'>
                  <Image
                    src='/backgroundone.webp'
                    className='absolute top-0 -right-36 rotate-[160deg]'
                    alt=''
                    width={260}
                    height={260}
                  />
                </div>
                <div className='flex flex-col justify-center items-center py-6 px-3'>
                  <p className='text-[#f5f5f5] text-2xl'>Electronic Voting</p>
                  <p className='text-[#737373] text-center text-base'>
                    Enables voters to cast their votes electronically,
                    eliminating the need for paper ballots
                  </p>
                </div>
              </div>
              <div className='grid gap-16 h-[340px] bg-[#262626] rounded-xl  overflow-hidden'>
                <div className='relative -mt-16'>
                  <Image
                    src='/backgroundone.webp'
                    className='absolute top-0 -left-36 rotate-[160deg]'
                    alt=''
                    width={260}
                    height={260}
                  />
                </div>
                <div className='flex flex-col justify-center items-center py-6 px-3'>
                  <p className='text-[#f5f5f5] text-2xl'>Tamper Proof</p>
                  <p className='text-[#737373] text-center text-base'>
                    Keep tamper proof records of your votes and data on onChain
                    and OffChain.
                  </p>
                </div>
              </div>
              <div className='grid relative gap-16 h-[340px] bg-[#262626] rounded-xl  overflow-hidden'>
                <Image
                  src='/blob.webp'
                  className='absolute bg-cover'
                  alt=''
                  fill
                />
                <div className='flex flex-col justify-center items-center py-6 px-3'>
                  <p className='text-[#f5f5f5] text-2xl'>dApp</p>
                  <p className='text-[#737373] text-center text-base'>
                    Included latest decentralized app security, with Multi
                    wallet support.
                  </p>
                </div>
              </div>
              <div className='grid gap-16 h-[340px] bg-[#262626] rounded-xl  overflow-hidden'>
                <div className='flex flex-col justify-center items-center py-6 px-3'>
                  <p className='text-[#f5f5f5] text-2xl'>Tamper Proof</p>
                  <p className='text-[#737373] text-center text-base'>
                    Keep tamper proof records of your votes and data on onChain
                    and OffChain.
                  </p>
                </div>
                <div className='relative -mb-16'>
                  <Image
                    src='/hollow.webp'
                    className='absolute bottom-0 -right-16'
                    alt=''
                    width={260}
                    height={260}
                  />
                </div>
              </div>
              <div className='grid relative  gap-16 h-[340px] bg-[#262626] rounded-xl px-3 overflow-hidden'>
                <div className='flex flex-col justify-start items-center py-6'>
                  <p className='text-[#f5f5f5] text-2xl'>Fast</p>
                  <p className='text-[#737373] text-center text-base'>
                    Fast an secure voting.
                  </p>
                </div>
                <Image
                  src='/dots.png'
                  className='absolute bottom-0 left-5'
                  alt=''
                  fill
                />
              </div>
              <div className='lg:col-span-2 relative  grid gap-16 h-[340px] bg-[#262626] rounded-xl px-3 overflow-hidden'>
                <Image src='/ring.webp' className='absolute' alt='' fill />
                <div className='flex flex-col justify-start items-center py-6'>
                  <p className='text-[#f5f5f5] text-center text-2xl'>
                    Ethereum Blockchain
                  </p>
                  <p className='text-[#737373] text-center text-base'>
                    Most secured blockchain ecosystem
                  </p>
                </div>
              </div>
              <div className='grid relative gap-16 h-[340px] bg-[#262626] rounded-xl px-3 overflow-hidden'>
                <Image src='/cardOne.webp' className='absolute' alt='' fill />
                <div className='flex flex-col justify-center items-center py-6'>
                  <p className='text-[#f5f5f5] text-2xl'>Decentralized</p>
                  <p className='text-[#737373] text-center text-base'>
                    Validated by millions of nodes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id='howitworks'
          className='pt-64 relative flex flex-col gap-8 justify-between items-center w-full overflow-hidden lg:pb-28'
        >
          <Image
            src='/crystalthree.webp'
            className='w-1/2 lg:w-auto absolute top-0 rotate-[5deg]'
            alt='crystal'
            width={200}
            height={200}
          />
          <Image
            src='/crystalone.webp'
            className='w-1/2 lg:w-auto absolute top-40 lg:top-28 -left-24'
            alt='crystal'
            width={400}
            height={400}
          />
          <Image
            src='/crystaltwo.webp'
            className='w-1/2 lg:w-auto absolute top-96 lg:top-32 -right-24'
            alt='crystal'
            width={600}
            height={600}
          />
          <div className='background-green bg-transparent w-32 flex justify-center items-center px-3 py-1 rounded-full'>
            <p className='text-white font-normal font-bricolage text-base'>
              ETH Network
            </p>
          </div>
          <div className='flex justify-center items-center px-3 lg:px-20'>
            <p className='text-white font-medium font-bricolage text-2xl md:text-3xl lg:text-4xl xl:text-6xl text-center'>
              Secured by ETH
            </p>
          </div>
          <div className='flex justify-center items-center pb-16'>
            <p className='text-[#737373] font-normal font-bricolage text-base lg:text-xl text-center'>
              votechain is secured by the most popular network in the world.
            </p>
          </div>
          <div className='px-3 lg:mt-10 z-30 relative w-5/6 lg:px-44 flex justify-center items-center shadow-xl bg-black rounded-xl py-8'>
            <Image
              src='/orbit.svg'
              className='absolute orbit-animation'
              alt='orbit'
              width={900}
              height={900}
            />
            <div className='w-full flex justify-center items-center'>
              <Image
                className='z-30 relative'
                src='/earth.webp'
                alt='earth'
                width={600}
                height={600}
              />
              <p className='text-white absolute z-40 font-bricolage text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                Tamper-proof in every way
              </p>
            </div>
          </div>
        </div>
        <div className='lg:pt-20 h-[800px] flex flex-col lg:grid lg:grid-cols-2 gap-8 justify-center px-3 lg:px-32 items-center w-full overflow-hidden z-20'>
          <Image
            src='/ecosystem.png'
            className=' order-last lg:order-1'
            alt='explore'
            width={600}
            height={600}
          />
          <div className='flex flex-col gap-3 z-30 order-1 lg:order-last'>
            <p className='text-white text-xl lg:text-4xl xl:text-6xl font-medium font-bricolage text-center'>
              Explore the Ecosystem
            </p>
            <p className='text-[#737373] font-bricolage font-normal text-base lg:text-2xl xl:text-4xl text-center'>
              Decentralized E-Voting platform.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
