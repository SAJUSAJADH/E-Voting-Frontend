'use client'

import { PreLoader } from '@/components/preLoader'
import VoterNavbar from '@/components/voterNavbar'
import { states } from '@/utils/province'
import { LoadingOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Select from 'react-select'

function Profile() {
  const [selectedState, setSelectedState] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [zipCode, setZipcode] = useState('')
  const { data: session, status } = useSession()
  const [fullname, setfullName] = useState('')
  const [voterId, setVoterId] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [preLoading, setPreLoading] = useState(true)

  const getVoterInfo = async () => {
    try {
      const { name } = session?.user
      fetch('/api/voter_validation', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const ok = (data?.message).includes('Voter found')
          if (ok) {
            const { isFound } = await data
            const { name, address, city, district, state, zipCode, voterId } =
              await isFound
            setfullName(name)
            setAddress(address)
            setCity(city)
            setVoterId(voterId)
            setSelectedDistrict({ label: district, value: district })
            setSelectedState({ label: state, value: state })
            setZipcode(zipCode)
            setTimeout(() => {
              setPreLoading(false)
            }, 2000)
          } else {
            setTimeout(() => {
              setPreLoading(false)
            }, 2000)
          }
        })
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        setPreLoading(false)
      }, 2000)
    }
  }

  useEffect(() => {
    getVoterInfo()
  }, [])

  const options = states.map((state) => ({
    label: state.label,
    value: state.value,
  }))

  const filteredOptions = selectedState
    ? states.find((state) => state.value === selectedState.value)?.districts ||
      []
    : []

  const changeZipcode = (event) => {
    const inputValue = event.target.value
    const regex = /^[0-9]{0,6}$/
    if (regex.test(inputValue)) {
      setZipcode(inputValue)
    }
  }

  const update = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const { name: digitalWallet } = session?.user
      const { label: district } = selectedDistrict
      const { label: state } = selectedState
      if (
        !fullname ||
        !address ||
        !voterId ||
        !city ||
        !state ||
        !district ||
        !zipCode
      ) {
        toast.error('please fill all the fields', { icon: '🚫' })
        setIsLoading(false)
        return
      }
      if (!digitalWallet) {
        setIsLoading(false)
        toast.error('Network busy', { icon: '🚫' })
        return
      }
      fetch('/api/update_voter', {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname,
          address,
          voterId,
          city,
          district,
          state,
          zipCode,
          digitalWallet,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          const ok = (data?.message).includes(
            'Voter details updated successfully'
          )
          if (ok) {
            toast.success('updated successfully')
            await getVoterInfo()
            setIsLoading(false)
          } else {
            setIsLoading(false)
            toast.error('invalid request id.', { icon: '🚫' })
          }
        })
        .catch((e) => {
          console.log(e)
          setIsLoading(false)
        })
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error('Network is busy', { icon: '🚫' })
    }
  }

  if (preLoading) {
    return <PreLoader />
  } else {
    return (
      <>
        <VoterNavbar route={'profile'} />
        <div className='w-full bg-[#353935] pt-28 lg:pt-36 px-3 lg:px-20 min-h-screen grid justify-center items-center pb-8 lg:pb-0'>
          <div className='pt-10 p-4 flex items-center justify-center'>
            <div className='container max-w-screen-lg mx-auto'>
              <div>
                <h2 className='font-semibold text-xl text-white'>
                  Personal Informations
                </h2>
                <p className='text-white mb-6'>
                  you can edit your personal informations.
                </p>

                <div className='bg-[#36454F] rounded shadow-lg p-4 px-4 md:p-8 mb-6'>
                  <div className='grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3'>
                    <div className='text-white'>
                      <p className='font-medium text-lg'>Personal Details</p>
                    </div>

                    <div className='lg:col-span-2'>
                      <div className='grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5'>
                        <div className='md:col-span-5'>
                          <label className='text-white' htmlFor='full_name'>
                            Full Name
                          </label>
                          <input
                            type='text'
                            name='name'
                            value={fullname}
                            onChange={(e) => setfullName(e.target.value)}
                            id='full_name'
                            className='h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-none'
                          />
                        </div>

                        <div className='md:col-span-5'>
                          <label className='text-white' htmlFor='voterId'>
                            Voter Id
                          </label>
                          <input
                            type='text'
                            disabled
                            value={voterId}
                            name='voterId'
                            id='voterId'
                            className='h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-none uppercase'
                          />
                        </div>

                        <div className='md:col-span-2'>
                          <label className='text-white' htmlFor='country'>
                            State / region
                          </label>
                          <div className='h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1'>
                            <Select
                              className='appearance-none outline-none text-gray-800 w-full bg-transparent'
                              options={options}
                              value={selectedState}
                              onChange={(selectedOption) => {
                                setSelectedState(selectedOption)
                                setSelectedDistrict(null)
                              }}
                            />
                          </div>
                        </div>

                        <div className='md:col-span-2'>
                          <label className='text-white' htmlFor='state'>
                            District
                          </label>
                          <div className='h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1'>
                            <Select
                              className='appearance-none outline-none text-gray-800 w-full bg-transparent'
                              options={filteredOptions}
                              value={selectedDistrict}
                              onChange={(selectedOption) =>
                                setSelectedDistrict(selectedOption)
                              }
                            />
                          </div>
                        </div>

                        <div className='md:col-span-1'>
                          <label className='text-white' htmlFor='zipcode'>
                            Zipcode
                          </label>
                          <input
                            type='text'
                            name='zipcode'
                            id='zipcode'
                            value={zipCode}
                            onChange={changeZipcode}
                            className='outline-none transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50'
                            placeholder=''
                          />
                        </div>

                        <div className='md:col-span-3'>
                          <label className='text-white' htmlFor='address'>
                            Address / Street
                          </label>
                          <input
                            type='text'
                            name='address'
                            id='address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className='h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-none'
                            placeholder=''
                          />
                        </div>

                        <div className='md:col-span-2'>
                          <label className='text-white' htmlFor='city'>
                            City
                          </label>
                          <input
                            type='text'
                            name='city'
                            id='city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className='h-10 border mt-1 rounded px-4 w-full bg-gray-50 outline-none'
                            placeholder=''
                          />
                        </div>

                        <div className='md:col-span-5 text-right pt-5'>
                          <div className='inline-flex items-end'>
                            <button
                              disabled={isLoading}
                              onClick={update}
                              className='bg-[#81fbe9] box-shadow text-black font-bold py-2 px-4 rounded'
                            >
                              {isLoading ? <LoadingOutlined /> : 'Update'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default Profile
