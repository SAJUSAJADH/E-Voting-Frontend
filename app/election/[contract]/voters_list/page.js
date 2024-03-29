'use client'

import AuthorityNavbar from '@/components/authorityNavbar'
import { PreLoader } from '@/components/preLoader'
import { LoadingOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Voters_List() {
  const { contract } = useParams()
  const [voterId, setVoterId] = useState('')
  const [removeId, setRemoveId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [Loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const [voters, setVoters] = useState([])
  const [preLoading, setPreLoading] = useState(true)

  const GetVoters = async () => {
    try {
      if (session) {
        const { name } = session?.user
        fetch('/server/api/get_voter', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, contract }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            const ok = (data?.message).includes('data found')
            const notOk =
              (data?.message).includes('not found') ||
              (data?.message).includes('Cant get it')
            if (ok) {
              const { voters } = await data?.electionLog
              setVoters(voters)
              setTimeout(() => {
                setPreLoading(false)
              }, 2000)
            }
            if (notOk) {
              console.log(data.status)
              setTimeout(() => {
                setPreLoading(false)
              }, 2000)
            }
          })
      }
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        setPreLoading(false)
      }, 2000)
    }
  }

  useEffect(() => {
    GetVoters()
  }, [session, status])

  const handleChange = (e) => {
    const inputValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
    setVoterId(inputValue.toUpperCase())
  }

  const idChange = (e) => {
    const inputValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
    setRemoveId(inputValue.toUpperCase())
  }

  const addVoter = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { name } = session?.user
      if (!voterId) {
        toast.error('Enter the Voters id')
        setIsLoading(false)
        return
      }
      if (voterId.length !== 10) {
        toast.error('Invalid Voter id')
        setIsLoading(false)
        return
      }
      if (!name) {
        toast.error('Network busy. Try again')
        setIsLoading(false)
        return
      }
      const voted = voters.filter((voter) => voterId === voter.voterid)
      if (voted.length !== 0) {
        toast.error('Already added')
        setIsLoading(false)
        return
      }
      fetch('/server/api/add_voter', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voterId, name }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const ok = (data?.message).includes('Voter added successfully')
          const notOk = (data?.message).includes(
            'Voter already exists in the list'
          )
          const closed = (data?.message).includes('Election closed')
          const networkError =
            (data?.message).includes('Election log not found') ||
            (data?.message).includes('Network busy')
          if (ok) {
            toast.success('Voter added Successfully')
            await GetVoters()
          }
          notOk && toast.error('Already registered')
          closed && toast.error('Election closed')
          networkError && toast.error('Network is busy. Try again')
          setIsLoading(false)
          setVoterId('')
        })
    } catch (error) {
      setIsLoading(false)
      toast.error('Network busy. Try again')
      console.log(error)
    }
  }

  const removeVoter = (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { name } = session?.user
      if (!removeId) {
        toast.error('Enter the Voters id')
        setLoading(false)
        return
      }
      if (removeId.length !== 10) {
        toast.error('Invalid Voter id')
        setLoading(false)
        return
      }
      if (!name) {
        toast.error('Network busy. Try again')
        setLoading(false)
        return
      }
      const voted = voters.filter((voter) => removeId === voter.voterid)
      if (voted[0].voted) {
        toast.error('Already Voted')
        setLoading(false)
        return
      }
      fetch('/server/api/remove_voter', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ removeId, name }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const ok = (data?.message).includes('Voter removed successfully')
          const notOk = (data?.message).includes(
            'Voter does not exist in the list'
          )
          const closed = (data?.message).includes('Election closed')
          const alreadyVoted = (data?.message).includes('Voter already voted')
          const networkError =
            (data?.message).includes('Election log not found') ||
            (data?.message).includes('Network busy')
          if (ok) {
            toast.success('Voter removed Successfully')
            await GetVoters()
          }
          notOk && toast.error('Voter does not exist')
          closed && toast.error('Election closed')
          alreadyVoted && toast.error('Too late...Voter already voted.')
          networkError && toast.error('Network is busy. Try again')
          setLoading(false)
          setRemoveId('')
        })
        .catch((error) => {
          toast.error('Network busy. Try again later.')
          setLoading(false)
          console.log(error)
        })
    } catch (error) {
      toast.error('Network busy. Try again later.')
      setLoading(false)
      console.log(error)
    }
  }

  if (preLoading) {
    return <PreLoader />
  } else {
    return (
      <>
        <AuthorityNavbar route={'voters_list'} />
        <div className='w-full bg-[#353935] pt-28 lg:pt-36 px-3 lg:px-20 min-h-screen '>
          <div className='w-full justify-center items-start flex flex-col gap-3'>
            <div className='w-full grid lg:grid-cols-2 gap-4'>
              <div className='w-full flex justify-center lg:justify-end items-center'>
                <div className='flex flex-col w-full lg:w-auto px-2 lg:px-8 rounded-lg py-2 lg:py-8 gap-4 lg:gap-8 bg-black z-20 shadow-xl'>
                  <div className='flex flex-col'>
                    <h3 className='text-xl font-semibold leading-6 text-white/50 tracking-tighter'>
                      Add Voter
                    </h3>
                    <p className='mt-1.5 text-sm font-medium text-white/50'>
                      Add eligible Voters to the election.
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <form>
                      <div className='grid lg:flex lg:gap-2'>
                        <div className='group w-full mt-4 lg:mt-0 relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                          <div className='flex justify-between'>
                            <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                              Voter Id
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
                            type='text'
                            name='voterId'
                            value={voterId}
                            onChange={handleChange}
                            placeholder='Voter Id'
                            autoComplete='off'
                            className='block uppercase w-full text-gray-400 border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                          />
                        </div>
                      </div>
                      <div className='mt-4 flex items-center justify-center gap-x-2'>
                        <button
                          disabled={isLoading}
                          onClick={addVoter}
                          className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                          type='submit'
                        >
                          {isLoading ? <LoadingOutlined /> : 'Add Voter'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className='w-full flex justify-center lg:justify-start items-center'>
                <div className='flex flex-col w-full lg:w-auto px-2 lg:px-8 rounded-lg py-2 lg:py-8 gap-4 lg:gap-8 bg-black z-20 shadow-xl'>
                  <div className='flex flex-col'>
                    <h3 className='text-xl font-semibold leading-6 text-white/50 tracking-tighter'>
                      Remove Voter
                    </h3>
                    <p className='mt-1.5 text-sm font-medium text-white/50'>
                      Remove Voters from the election.
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <form>
                      <div className='grid lg:flex lg:gap-2'>
                        <div className='group w-full mt-4 lg:mt-0 relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                          <div className='flex justify-between'>
                            <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                              Voter Id
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
                            type='text'
                            name='voterId'
                            value={removeId}
                            onChange={idChange}
                            placeholder='Voter Id'
                            autoComplete='off'
                            className='block uppercase w-full text-gray-400 border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                          />
                        </div>
                      </div>
                      <div className='mt-4 flex items-center justify-center gap-x-2'>
                        <button
                          disabled={Loading}
                          onClick={removeVoter}
                          className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                          type='submit'
                        >
                          {Loading ? <LoadingOutlined /> : 'Remove Voter'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex w-full justify-center items-center'>
              <div className='h-[40vh] lg:w-2/4 rounded-xl  mx-2 flex flex-col justify-start items-center py-3 bg-[#36454F]'>
                <div className='flex justify-between items-center bg-[#36454F] z-30'>
                  <p className='text-white font-medium font-bricolage text-lg lg:text-4xl'>
                    Voters List
                  </p>
                </div>
                <div className='w-full custom-scrollbar overflow-y-auto flex justify-start items-start px-3 py-3'>
                  <div className='w-full flex flex-wrap justify-center gap-3'>
                    {voters && (
                      <>
                        {voters.map((voter, index) => (
                          <p
                            key={index}
                            className={`text-sm lg:text-base ${voter.voted == false ? 'hover:text-[#a3a3a3] text-[#f5f5f5]' : 'text-[#a3a3a3]'} font-bricolage px-1 lg:px-2 cursor-pointer`}
                          >
                            {index + 1} . {voter.voterid}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Voters_List
