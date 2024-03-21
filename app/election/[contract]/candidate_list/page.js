'use client'

import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import axios from 'axios'
import { unstable_noStore as noStore } from 'next/cache'
import { Get_candidates, add_Candidate } from '@/blockchainActions/addCandidate'
import { useParams } from 'next/navigation'
import { GetNumberofParticipants } from '@/blockchainActions/getElectionData'
import { getElectionContract } from '@/blockchainActions/getElectioncontract'
import AuthorityNavbar from '@/components/authorityNavbar'
import { useSession } from 'next-auth/react'
import { PreLoader } from '@/components/preLoader'

function Candidate_List() {
  const { contract } = useParams()
  const { data: session, status } = useSession()
  const { name } = session?.user ?? {
    name: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  }
  const fileInputRef = useRef(null)
  const nameRef = useRef(null)
  const vorterIdRef = useRef(null)
  const descriptionRef = useRef(null)
  const [preLoading, setPreLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [Form, setForm] = useState({
    candidateName: '',
    voterId: '',
    candidateDescription: '',
  })
  const [Loading, setLoading] = useState(false)
  const [candidates, setCandidates] = useState([])

  async function validateAuthority() {
    try {
      const electionContract = await getElectionContract()
      const transactionResponse =
        await electionContract.getDeployedElection(name)
      if (transactionResponse[0] === contract) {
        GetNumberofParticipants(transactionResponse[0]).then((response) => {
          Get_candidates(transactionResponse[0], response[0]).then(
            (response) => {
              if (response.length > 0) {
                setCandidates(response)
              }
              setTimeout(() => {
                setPreLoading(false)
              }, 2000)
            }
          )
        })
      } else {
        setTimeout(() => {
          setPreLoading(false)
        }, 2000)
      }
    } catch (error) {
      setTimeout(() => {
        setPreLoading(false)
      }, 2000)
      console.log(error)
      toast(`${error}`, { icon: '🚫' })
    }
  }

  useEffect(() => {
    validateAuthority()
  }, [name])

  const pinFileToIPFS = async (file) => {
    noStore()
    const formData = new FormData()
    formData.append('file', file)

    const pinataMetadata = JSON.stringify({
      name: file.name,
    })
    formData.append('pinataMetadata', pinataMetadata)

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions)

    try {
      const JWT = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_PINATA_API_URL,
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${JWT}`,
          },
        }
      )
      const { IpfsHash } = data
      return IpfsHash
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const ImageHashing = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    setSelectedFile(file)
  }

  const handleChange = (e, name) => {
    let value

    if (name === 'voterId') {
      value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
    } else {
      value = e.target.value
    }
    setForm((prevState) => ({ ...prevState, [name]: value }))
  }

  const addCandidate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { candidateName, voterId, candidateDescription } = Form
      const id = voterId.toUpperCase()
      if (!candidateName || !id || !candidateDescription) {
        toast.error('Please fill all the fields.')
        setLoading(false)
        return
      }
      if (!selectedFile) {
        toast.error('Provide candidate logo.')
        setLoading(false)
        return
      }
      if (id.length !== 10) {
        toast.error('Invalid voter Id.')
        setLoading(false)
        return
      }
      pinFileToIPFS(selectedFile).then(async (response) => {
        const imageHash = response
        if (!imageHash) {
          toast.error('Pinata Network busy')
          setLoading(false)
          return
        }
        const res = await add_Candidate(
          contract,
          candidateName,
          id,
          imageHash,
          candidateDescription
        )
        const ok = (res?.message).includes('success')
        const notOk = (res?.message).includes('Failed')
        const processing = (res?.message).includes('processing')
        if (ok) {
          toast.success('Added Candidate successfully')
          setSelectedFile(null)
          setForm({
            candidateName: '',
            voterId: '',
            candidateDescription: '',
          })
          fileInputRef.current.value = ''
          nameRef.current.value = ''
          vorterIdRef.current.value = ''
          descriptionRef.current.value = ''
          setLoading(false)
          validateAuthority()
        }
        if (notOk) {
          toast.error('Candidate not added.')
          setForm({
            candidateName: '',
            voterId: '',
            candidateDescription: '',
          })
          nameRef.current.value = ''
          vorterIdRef.current.value = ''
          descriptionRef.current.value = ''
          setSelectedFile(null)
          fileInputRef.current.value = ''
          setLoading(false)
        }
        if (processing) {
          toast('Processing your candidature. It will take upto 2-5 minutes', {
            icon: '⏳',
            duration: 6000,
          })
          setSelectedFile(null)
          setForm({
            candidateName: '',
            voterId: '',
            candidateDescription: '',
          })
          fileInputRef.current.value = ''
          nameRef.current.value = ''
          vorterIdRef.current.value = ''
          descriptionRef.current.value = ''
          setLoading(false)
          validateAuthority()
        }
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error('Something went wrong')
    }
  }

  const candidateMapping = candidates.map((candidate, index) => {
    return (
      <div
        key={index}
        className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'
      >
        <div className='flex flex-col gap-3 justify-start items-start'>
          <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
            Candidate Name: {candidate[0]}
          </p>
          <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
            Candidate Description: {candidate[1].toString().substring(0, 20)}...
          </p>
          <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
            Candidate ID: {index + 1001}
          </p>
          <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
            Voter Id: {candidate[4]}
          </p>
          <div className='flex justify-between items-center'>
            <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
              Candidate Logo:{' '}
            </p>
            <Image
              src={`https://gateway.pinata.cloud/ipfs/${candidate[2]}`}
              className='rounded-full'
              alt='logo'
              width={30}
              height={30}
            />
          </div>
          <div className='flex justify-between items-center text-green-200'>
            <p className='hover:text-green-300 text-sm font-normal font-bricolage px-2 cursor-pointer'>
              Approved{' '}
            </p>
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
      </div>
    )
  })

  if (preLoading) {
    return <PreLoader />
  } else {
    return (
      <>
        <AuthorityNavbar route={'candidates_list'} />
        <div className='w-full bg-[#353935] pt-28 lg:pt-36 px-3 lg:px-20 min-h-screen grid justify-center items-center'>
          <div className='w-full flex justify-center items-start'>
            <div className='flex flex-col px-2 lg:px-8 rounded-lg py-2 lg:py-8 gap-8 bg-black z-20 shadow-xl'>
              <div className='flex flex-col'>
                <h3 className='text-xl font-semibold leading-6 text-white/50 tracking-tighter'>
                  Add Candidate
                </h3>
                <p className='mt-1.5 text-sm font-medium text-white/50'>
                  Add eligible candidates to the election.
                </p>
              </div>
              <div className='flex flex-col'>
                <form>
                  <div className='grid lg:flex lg:gap-2'>
                    <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                      <div className='flex justify-between'>
                        <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                          Candidate name
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
                        onChange={(e) => handleChange(e, 'candidateName')}
                        ref={nameRef}
                        type='text'
                        name='candidateName'
                        placeholder='Candidate name'
                        autoComplete='off'
                        className='block w-full text-gray-400 border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                      />
                    </div>
                    <div className='group mt-4 lg:mt-0 relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
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
                        onChange={(e) => handleChange(e, 'voterId')}
                        ref={vorterIdRef}
                        type='text'
                        name='voterId'
                        value={Form.voterId}
                        placeholder='Voter Id'
                        autoComplete='off'
                        className='block w-full text-gray-400 border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                      />
                    </div>
                    <div className='group mt-4 lg:mt-0 relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                      <div className='flex justify-between'>
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
                        onChange={(e) => ImageHashing(e)}
                        ref={fileInputRef}
                        type='file'
                        name='logo'
                        accept='image/jpeg'
                        autoComplete='off'
                        className='block w-full cursor-pointer text-gray-400 border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground'
                      />
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div>
                      <div className='group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30'>
                        <div className='flex justify-between'>
                          <label className='text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400'>
                            Candidate Description
                          </label>
                        </div>
                        <div className='flex items-center'>
                          <textarea
                            onChange={(e) =>
                              handleChange(e, 'candidateDescription')
                            }
                            ref={descriptionRef}
                            row={6}
                            style={{ resize: 'none' }}
                            type='text'
                            placeholder='Candidate description'
                            name='candidateDescription'
                            className='block text-gray-400 w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {Loading && (
                    <div className='mt-4 flex items-center justify-center gap-x-2 my-3'>
                      <p className='text-[#a3a3a3] text-sm font-normal font-bricolage px-2 text-center'>
                        This may take some time.
                      </p>
                    </div>
                  )}
                  <div className='mt-4 flex items-center justify-center gap-x-2'>
                    <button
                      onClick={addCandidate}
                      className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'
                      type='submit'
                    >
                      {Loading ? <LoadingOutlined /> : 'Add Candidate'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full bg-[#353935] px-3 lg:px-8 flex flex-col justify-center items-center pb-8'>
          <div className='flex w-full justify-center pb-10'>
            <p className='text-white font-medium font-bricolage text-lg lg:text-4xl xl:text-5xl'>
              Candidates List
            </p>
          </div>
          {candidates.length == 0 ? (
            <div className='h-[10vh] px-3 flex justify-center items-center'>
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                No Candidates added yet.
              </p>
            </div>
          ) : (
            <div className='grid md:grid-cols-2 lg;grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
              {candidateMapping}
            </div>
          )}
        </div>
      </>
    )
  }
}

export default Candidate_List
