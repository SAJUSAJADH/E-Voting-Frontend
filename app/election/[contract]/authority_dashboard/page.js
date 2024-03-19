'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  FileProtectOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import toast from 'react-hot-toast'
import { chart as ChartJS } from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import {
  GetElectionDetails,
  GetNumberofParticipants,
} from '@/blockchainActions/getElectionData'
import { getElectionContract } from '@/blockchainActions/getElectioncontract'
import AuthorityNavbar from '@/components/authorityNavbar'
import { useSession } from 'next-auth/react'
import { Get_candidates } from '@/blockchainActions/addCandidate'
import { Announce_winner } from '@/blockchainActions/announceWinner'

function Authority_Dashboard() {
  const { contract } = useParams()
  const { data: session } = useSession()
  const { name } = session?.user ?? {
    name: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  }
  const [isLoading, setIsLoading] = useState(false)
  const [electionData, setElectionData] = useState({
    electionName: '',
    electiondescription: '',
  })
  const [numofParticipants, setNumofParticipants] = useState({
    numOfCandidates: 0,
    numofVoters: 0,
  })
  const [candidates, setCandidates] = useState([
    { 0: 'A', 1: '', 2: '', 3: 200 },
    { 0: 'B', 1: '', 2: '', 3: 300 },
    { 0: 'C', 1: '', 2: '', 3: 400 },
  ])
  const [totalVotes, setTotalVotes] = useState(0)
  const [voters, setVoters] = useState(0)

  useEffect(() => {
    async function validateAuthority() {
      try {
        const electionContract = await getElectionContract()
        const transactionResponse =
          await electionContract.getDeployedElection(name)
        if (transactionResponse[0] === contract) {
          GetElectionDetails(transactionResponse[0]).then((response) => {
            setElectionData({
              electionName: response[0],
              electiondescription: response[1],
            })
          })
          GetNumberofParticipants(transactionResponse[0]).then((response) => {
            setNumofParticipants({
              numOfCandidates: parseInt(response[0]),
              numofVoters: parseInt(response[1]),
            })
            Get_candidates(transactionResponse[0], response[0]).then(
              (response) => {
                if (response.length > 0) {
                  setCandidates(response)
                  let totalVotes = 0
                  response.map((res) => {
                    const voteCount = res[3]
                    totalVotes = totalVotes + parseInt(voteCount)
                  })
                  setTotalVotes(totalVotes)
                }
              }
            )
          })
        } else {
          setElectionData({
            electionName: '',
            electiondescription: '',
          })
          setNumofParticipants({
            numOfCandidates: 0,
            numofVoters: 0,
          })
          setTotalVotes(0)
        }
      } catch (error) {
        console.log(error)
        toast(`Please connect your wallet`, { icon: '🚫' })
      }
    }
    validateAuthority()
  }, [])

  useEffect(() => {
    async function voters() {
      try {
        if (session) {
          fetch('/api/get_voter', {
            cache: 'no-store',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
          })
            .then((response) => response.json())
            .then(async (data) => {
              const ok = (data?.message).includes('data found')
              if (ok) {
                const { electionLog } = await data
                const { voters } = await electionLog
                const Totalvoters = voters?.length
                setVoters(Totalvoters)
              }
            })
            .catch((error) => console.log(error))
        }
      } catch (error) {
        console.log(error)
      }
    }
    voters()
  }, [session])

  const labels = candidates.map((obj) => obj[0])
  const values = candidates.map((obj) => parseInt(obj[3]))
  // const values = [500, 600, 800]

  const CandidateData = {
    labels: labels,
    datasets: [
      {
        label: 'Vote Count',
        data: [200, 300, 400],
        backgroundColor: [
          'rgba(0, 0, 204)',
          'rgba(255, 0, 0)',
          'rgba(255, 0, 127)',
          'rgba(0, 0, 255)',
          'rgba(0, 255, 0)',
          'rgba(255, 255, 51)',
          'rgba(255, 128, 0)',
        ],
        barThickness: 50,
      },
    ],
  }

  const CandidateOptions = {
    scales: {
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': ' + context.formattedValue
          },
        },
      },
    },
  }

  const votersData = {
    labels: ['Voted', 'NotVoted'],
    datasets: [
      {
        label: 'Vote Count',
        data: [200, 300],
        backgroundColor: [
          'rgba(255, 0, 127)',
          'rgba(0, 0, 255)',
          'rgba(0, 255, 0)',
          'rgba(255, 255, 51)',
          'rgba(255, 128, 0)',
          'rgba(0, 0, 204)',
          'rgba(255, 0, 0)',
        ],
        barThickness: 50,
      },
    ],
  }

  const votersOption = {
    scales: {
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': ' + context.formattedValue
          },
        },
      },
    },
  }

  if (values.filter((value) => value !== 0).length > 0) {
    CandidateData.datasets[0].data = values
  }

  if (voters > 0) {
    votersData.datasets[0].data = [totalVotes, voters - totalVotes]
  }

  const EndElection = async () => {
    setIsLoading(true)
    try {
      const ElectionContract = await getElectionContract()
      const transactionResponse = await ElectionContract.getDeployedElection(name)
      Announce_winner(transactionResponse[0]).then((response)=>console.log(response))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error('Network unavailable')
      console.log(error)
    }
  }

  return (
    <>
      <AuthorityNavbar route='dashboard' />
      <div className='w-full bg-[#353935] pt-28 lg:pt-36 px-3 lg:px-20 min-h-screen grid justify-start items-start pb-8 lg:pb-0'>
        <div className='grid lg:grid-cols-4 gap-4 w-full'>
          <div className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'>
            <div className='flex flex-col gap-3 justify-start items-start'>
              <p onClick={()=>toast(`${electionData.electionName}`,{position:'top-right'})} className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Election Name: {electionData.electionName.substring(0, 20)}
              </p>
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Election Authority:{' '}
                {`${name.toString().substring(0, 5)}****${name.toString().substring(name.toString().length - 5)}`}
              </p>
              <p onClick={()=>toast(`${electionData.electiondescription}`,{position:'top-right'})} className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Election Description:{' '}
                {electionData.electiondescription.substring(0, 15)}
              </p>
            </div>
          </div>
          <div className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'>
            <div className='flex flex-col gap-3 justify-start items-center'>
              <UserOutlined className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer' />
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Total Candidates{' '}
              </p>
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                {numofParticipants.numOfCandidates}
              </p>
            </div>
          </div>
          <div className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'>
            <div className='flex flex-col gap-3 justify-start items-center'>
              <UsergroupAddOutlined className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer' />
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Total Voters{' '}
              </p>
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                {voters}
              </p>
            </div>
          </div>
          <div className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'>
            <div className='flex flex-col gap-3 justify-start items-center'>
              <FileProtectOutlined className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer' />
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Total Votes{' '}
              </p>
              <p className='text-[#a3a3a3] hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                {numofParticipants.numofVoters}
              </p>
            </div>
          </div>
        </div>
        <div className='pt-2 grid lg:grid-cols-4 gap-4 w-full'>
          <div className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'>
            <div className='grid gap-3 justify-center items-center'>
              <UserOutlined className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer' />
              <p className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Total Candidates{' '}
              </p>
              <p className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                The Number of Candidates and the votes they gained through the
                election conducted onChain.{' '}
              </p>
            </div>
          </div>
          <div className='bg-[#36454F] flex flex-col justify-center items-center px-2 py-2 rounded-xl'>
            <Doughnut data={CandidateData} options={CandidateOptions} />
          </div>
          <div className='grid gap-16 bg-[#36454F] rounded-xl px-3 py-3'>
            <div className='grid gap-3 justify-center items-center'>
              <UsergroupAddOutlined className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer' />
              <p className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Voters count
              </p>
              <p className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                The Number of Total Voters and the number of voters who have
                participated in the elction conducted onChain.{' '}
              </p>
            </div>
          </div>
          <div className='bg-[#36454F] flex flex-col justify-center items-center px-2 py-2 rounded-xl'>
            <Doughnut data={votersData} options={votersOption} />
          </div>
        </div>
        <div className='w-full mt-4 rounded flex justify-between bg-[#36454F] px-3 py-3'>
          <div className='flex justify-center items-center'>
          <p className='text-[#a3a3a3] text-center hover:text-[#f5f5f5] text-sm font-normal font-bricolage px-2 cursor-pointer'>
                Announce the winners of {electionData.electionName}.
              </p>
          </div>
          <div className='flex justify-center items-center'>
            <button onClick={EndElection} className='font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2'>
              End Election
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Authority_Dashboard
