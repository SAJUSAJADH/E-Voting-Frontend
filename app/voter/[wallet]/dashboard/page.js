'use client'

import { Get_candidates } from '@/blockchainActions/addCandidate'
import { GetNumberofParticipants } from '@/blockchainActions/getElectionData'
import { getElectionContract } from '@/blockchainActions/getElectioncontract'
import VoterNavbar from '@/components/voterNavbar'
import { LoadingOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Vote } from '@/blockchainActions/vote'
import toast from 'react-hot-toast'
import { PreLoader } from '@/components/preLoader'


function Dashboard() {
  const [selectedElection, setSelectedElection] = useState(null)
  const [options, setOptions] = useState([])
  const { data: session, status } = useSession()
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [preLoading, setPreLoading] = useState(true)
  const [electionStatus, setElectionStatus] = useState(false)
  const [buttonLoading, setButtonLoading] = useState({
    index: null,
    status: false,
  })
  const [voterId, setVoterId] = useState(null)
  const [Loading, setLoading] = useState(false)
  const [faceAuthenticated, setFaceAuthenticated] = useState(false)

  let userId = ''

  voterId !== null && (userId = voterId)

  async function getAvailableElectionsandFaceRegStatus() {
    try {
      if (session) {
        const { name } = session?.user
        const response = await fetch('/server/api/get_elections', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        })
        const data = await response.json()
        const ok = (data?.message).includes('Ongoing elections found')
        if (ok) {
          const { ongoingElections } = await data
          const electionsData = ongoingElections.map((election) => ({
            label: election.electionname,
            value: election.address,
            status: election.voters[0].voted,
            address: election.address,
            electionName: election.electionname,
            description: election.electiondescription,
          }))
          setOptions(electionsData)
        }
        const face_reg = await fetch('/server/api/face_reg_status', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        })
        const face_data = await face_reg.json()
        const notValidated =
          (await (face_data?.message).includes('Not validated'))
        const validated = (await (face_data?.message).includes('face validated'))
        if (notValidated) {
          const { id } = await face_data
          setVoterId(id)
          setFaceAuthenticated(false)
        }
        if(validated){
          const { id } = await face_data
          setVoterId(id)
          setFaceAuthenticated(true)
        }
        setTimeout(() => {
          setPreLoading(false)
        }, 1000)
      }
    } catch (error) {
      setTimeout(() => {
        setPreLoading(false)
      }, 2000)
      console.log(error)
    }
  }

  async function getParticularElectionData() {
    if (selectedElection) {
      setIsLoading(true)
      const { value, status } = selectedElection
      if (!status) {
        const electionContract = await getElectionContract()
        const transactionResponse =
          await electionContract.getDeployedElection(value)
        const numberOfParticipants = await GetNumberofParticipants(
          transactionResponse[0]
        )
        const numberOfcandidates = await numberOfParticipants[0]
        const response = await Get_candidates(
          transactionResponse[0],
          numberOfcandidates
        )
        response.length > 0 && setCandidates(response)
      } else {
        setElectionStatus(status)
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAvailableElectionsandFaceRegStatus()
  }, [session, status])

  useEffect(() => {
    getParticularElectionData()
  }, [selectedElection])

  const handleVote = async (e, candidateId, address) => {
    e.preventDefault()
    setButtonLoading({
      index: candidateId,
      status: true,
    })
    try {

      const result = await fetch('/api/detect_face', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId})
      })

      const result_data = await result.json()
      const { message } = result_data
      const success = message.includes('Face Reg Successfull')
      if(success){
        if ((candidateId, address, session)) {
          const { name } = session?.user
          const { address } = selectedElection
          const electionContract = await getElectionContract()
          const transactionResponse =
            await electionContract.getDeployedElection(address)
          const response = await Vote(candidateId, name, transactionResponse[0])
          const ok = (response?.message).includes('voted')
          const notOk = (response?.message).includes('internal server error')
          const processing = (response?.message).includes('processing')
          if (ok || processing) {
            fetch('/server/api/update_electionlog', {
              cache: 'no-store',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name,
                electionName: selectedElection.electionName,
                description: selectedElection.description,
                address: selectedElection.address,
              }),
            })
              .then((response) => response.json())
              .then(async (data) => {
                setElectionStatus(true)
                setCandidates([])
                toast.success('voted successfully')
                setButtonLoading({
                  index: null,
                  status: false,
                })
              })
          } else {
            toast.error('something went wrong')
            setButtonLoading({
              index: null,
              status: false,
            })
          }
        }
      }else{
        toast.error('Face Recognition failed. Please Try again', {
          icon: '🚫',
        })
        setButtonLoading({
          index: null,
          status: false,
        })
      }
    } catch (error) {
      setButtonLoading({
        index: null,
        status: false,
      })
      console.log(error)
    }
  }

  const FaceDetect = async () => {
    try {
      setLoading(true)
      fetch('/api/detect_face', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: voterId }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const { message } = await data
          console.log(data)
          const success = message.includes('Face Reg Successfull')
          if (success) {
            fetch('/server/api/face_reg', {
              cache: 'no-store',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ voterId }),
            })
              .then((response) => response.json())
              .then(async (data) => {
                console.log(data)
                const { message } = await data
                const ok = message.includes('Face ID updated successfully')
                if (ok) {
                  toast.success('Face Enrollment Success')
                  setLoading(false)
                  setFaceAuthenticated(true)
                } else {
                  setIsLoading(false)
                  toast.error('Registration failed. Please Try again', {
                    icon: '🚫',
                  })
                }
              })
          } else {
            toast.error('Registration failed. Please Try again', { icon: '🚫' })
            setLoading(false)
          }
        })
        .catch((e) => {
          console.error(e)
          setLoading(false)
          toast.error('Registration failed. Please Try again', { icon: '🚫' })
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error('Registration failed. Please Try again', { icon: '🚫' })
    }
  }

  if (preLoading) {
    return <PreLoader />
  } else {
    return (
      <>
        <VoterNavbar route={'dashboard'} />
        <div className='w-full bg-[#353935] pt-28 lg:pt-36 px-3 lg:px-20 min-h-screen justify-center items-start pb-8 lg:pb-0'>
          {!faceAuthenticated ? (
            <>
              <div className='w-full flex flex-wrap justify-center items-center'>
                <p className='text-white font-medium font-bricolage text-lg lg:text-4xl xl:text-5xl'>
                  Please Enroll Your Face
                </p>
              </div>
              <div className='bg-[#36454F] rounded shadow-lg p-4 px-4 md:p-8 mb-6 mt-10'>
                <div className='grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3'>
                  <div className='text-white'>
                    <p className='font-medium text-lg'>Face Enrollment</p>
                    <p>Please avoid wearing glasses or hats.</p>
                  </div>

                  <div className='lg:col-span-2 h-[40vh] flex justify-end items-end'>
                    <button
                      disabled={Loading}
                      onClick={FaceDetect}
                      className='bg-[#81fbe9] box-shadow text-black font-bold py-2 px-4 rounded'
                    >
                      {Loading ? <LoadingOutlined /> : 'Enroll Face'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='w-full flex flex-wrap justify-center items-center'>
                <p className='text-white font-medium font-bricolage text-lg lg:text-4xl xl:text-5xl'>
                  Available Elections To Record your Vote
                </p>
              </div>
              <div className='w-full pt-8 flex flex-col justify-center items-center'>
                <div className='flex flex-col gap-4 w-full lg:w-2/4 bg-[#36454F] rounded-xl px-2 py-2 justify-center items-start'>
                  <label className='text-white font-bricolage text-base'>
                    Select Election
                  </label>
                  <Select
                    className='appearance-none outline-none text-gray-800 w-full bg-transparent'
                    options={options}
                    value={selectedElection}
                    onChange={(selectedOption) => {
                      setSelectedElection(selectedOption)
                    }}
                  />
                </div>
              </div>
            </>
          )}
          <div className='grid lg:grid-cols-4 gap-4 pt-10'>
            {candidates.length > 0 &&
              candidates.map((candidate, index) => (
                <div
                  key={index}
                  className='bg-[#36454F] relative flex flex-col gap-2 rounded-xl px-2 py-3 '
                >
                  <div className='flex text-wrap justify-center items-center'>
                    <Image
                      src={`https://gateway.pinata.cloud/ipfs/${candidate[2]}`}
                      className='rounded-full'
                      alt='logo'
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className='flex text-wrap justify-start items-start'>
                    <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-base font-normal font-bricolage px-2 cursor-pointer'>
                      {candidate[0]}
                    </p>
                  </div>
                  <div className='flex text-wrap justify-start px-1 items-start border-b border-gray-400'>
                    <p className='text-[#a3a3a3] hover:text-[#f5f5f5] py-1 text-base font-normal font-bricolage px-2 cursor-pointer'>
                      Candidate Description
                    </p>
                  </div>
                  <div className='flex text-wrap justify-start items-start'>
                    <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-base font-normal font-bricolage px-2 cursor-pointer'>
                      {candidate[1]}
                    </p>
                  </div>
                  <div className='flex text-wrap justify-center items-center pt-8'>
                    <button
                      disabled={buttonLoading.status}
                      onClick={(e) =>
                        handleVote(e, index, selectedElection.address)
                      }
                      className='absolute bottom-3 right-3 font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                    >
                      {index === buttonLoading.index &&
                      buttonLoading.status === true ? (
                        <LoadingOutlined />
                      ) : (
                        'Vote'
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          {electionStatus && candidates.length === 0 && (
            <div className='pt-10 flex w-full justify-center items-center text-center'>
              <p className='text-[#f5f5f5] text-lg font-normal font-bricolage px-2 cursor-pointer'>
                You have already voted for this election.
              </p>
            </div>
          )}
          {!electionStatus && candidates.length === 0 && (
            <div className='pt-10 flex w-full justify-center items-center text-center'>
              <p className='text-[#f5f5f5] text-lg font-normal font-bricolage px-2 cursor-pointer'>
                {isLoading ? (
                  <LoadingOutlined />
                ) : (
                  'You have no available election to particpate.'
                )}
              </p>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default Dashboard
