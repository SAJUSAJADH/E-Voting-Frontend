'use client'

import Menu from '@/components/menu'
import { FileProtectOutlined, LoadingOutlined } from '@ant-design/icons'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Card } from 'antd'

function Voters_List() {
  const [votersList, setVotersList] = useState([])
  const [voterId, setVoterId] = useState('')
  const [Loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [callData, setCallData] = useState(false)

  useEffect(() => {
    try {
      fetch('/api/add_voter', {
        next: { revalidate: 10 },
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { voters } = data
          setVotersList(voters)
        })
    } catch (error) {
      console.log(error)
    }
  }, [callData])

  const RegisterVoter = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (voterId.length === 6) {
        const registerVoter = fetch('/api/add_voter', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ voterId }),
        })
          .then((response) => response.json())
          .then((data) => {
            const ok = (data?.message).includes('Added voter Successfully')
            const networkDown = (data?.message).includes('Failed to add voter')
            const notOk = (data?.message).includes('voter already exist')
            ok && setCallData(!callData)
            notOk && toast.error('Voter is already Registered')
            networkDown && toast.error('Network down. Try again')
            setVoterId('')
            setLoading(false)
          })
        toast.promise(
          registerVoter,
          {
            loading: `Registering Voter - ${voterId}`,
            success: (data) => `Finished Processing`,
            error: (err) => `Network unAvailable`,
          },
          {
            style: {
              minWidth: '250px',
            },
            success: {
              duration: 5000,
              icon: '✔️',
            },
          }
        )
      } else {
        toast.error('Enter a valid voterId')
        setVoterId('')
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      toast.error('Network not available. Try again')
      setVoterId('')
      setLoading(false)
    }
  }

  const removeVoter = async (v) => {
    const id = v.voterId
    setRemoving(true)
    try {
      const removalPromise = fetch('/api/remove_voter', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          const ok = (data?.message).includes('removed voter')
          const notOk =
            (data?.message).includes('Failed to Remove user') ||
            (data?.message).includes('Try after some time')
          ok && setCallData(!callData)
          notOk && toast.error('Network unavailable. Try again')
          setRemoving(false)
        })
      toast.promise(
        removalPromise,
        {
          loading: `Removing Voter - ${id}`,
          success: (data) => `Finished Processing`,
          error: (err) => `Network unAvailable`,
        },
        {
          style: {
            minWidth: '250px',
          },
          success: {
            duration: 5000,
            icon: '✔️',
          },
        }
      )
    } catch (error) {
      console.log(error)
      setRemoving(false)
      notOk && toast.error('Network unavailable. Try again')
    }
  }

  const votersMapping = votersList.map((voter, index) => {
    return (
      <Card
        key={index}
        title={voter.voterId}
        bordered={true}
        style={{
          width: 300,
        }}
        className='border border-green-400'
      >
        <button
          disabled={removing}
          onClick={() => removeVoter(voter)}
          className='text-white uppercase px-3 bg-orange-500 hover:bg-orange-600 py-2 font-bricolage font-light text-base border border-white rounded-lg hover:text-white hover:border-orange-600'
        >
          Remove
        </button>
        <button
          disabled={true}
          className='text-white uppercase px-3 bg-red-500 hover:bg-red-600 py-2 font-bricolage font-light text-base border border-white rounded-lg hover:text-white hover:border-red-600'
        >
          Not voted
        </button>
      </Card>
    )
  })

  return (
    <>
      <Menu route={'voters_list'} />
      <div className='w-full flex justify-center pt-28 px-3 lg:px-20 py-6'>
        <div className='grid gap-2'>
          <span
            onClick={() => toast('Election Description', { duration: 6000 })}
            className='flex cursor-pointer justify-center items-center gap-2 text-dark-purple'
          >
            <FileProtectOutlined /> Election Name
          </span>
        </div>
      </div>
      <div className='container mx-auto px-3 lg:px-20 py-3'>
        <div className='flex justify-center items-center'>
          <div className='grid'>
            <div className='relative w-full z-20'>
              <div className='bg-black px-6 lg:px-10 text-white mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none'>
                <div className='flex flex-col p-4'>
                  <h3 className='text-xl font-semibold leading-6 tracking-tighter'>
                    Register Voter
                  </h3>
                </div>
                <div className='p-6 pt-0'>
                  <form>
                    <div>
                      <div className='grid gap-3'>
                        <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                          <div className='flex justify-between'></div>
                          <input
                            type='text'
                            name='voterId'
                            value={voterId}
                            onChange={(e) => setVoterId(e.target.value)}
                            placeholder='6 digit VoterId'
                            autoComplete='off'
                            className='block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='mt-4 flex items-center justify-center gap-x-2'>
                      <button
                        onClick={RegisterVoter}
                        disabled={Loading}
                        className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                        type='submit'
                      >
                        {Loading ? <LoadingOutlined /> : 'Register'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className='cursor-pointer py-6 text-center lg:text-start text-xl lg:text-3xl text-[#080a45] font-semibold font-bricolage'>
          Voters List
        </p>
        <div className='grid lg:grid-cols-3 xl:grid-cols-4 justify-center gap-3 lg:justify-start'>
          {votersMapping}
        </div>
      </div>
    </>
  )
}

export default Voters_List
