import ElectionLog from '@/databaseModels/electionLogsSchema'
import Voter from '@/databaseModels/voterSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name, electionName, description, address } = await request.json()

    const voter = await Voter.findOne({ digitalWallet: name })

    if (!voter) {
      return NextResponse.json({
        message: 'Unauthorized user found',
        status: 401,
      })
    }

    const electionLog = await ElectionLog.findOne({
      electionname: electionName,
      electiondescription: description,
      address: address,
      status: true,
    })

    if (!electionLog) {
      return NextResponse.json({
        message: 'No ongoing elections found for this voter',
        status: 404,
      })
    }

    if (voter) {
      const { voterId } = voter
      const voterIndex = electionLog.voters.findIndex(
        (voter) => voter.voterid === voterId
      )
      if (voterIndex !== -1) {
        electionLog.voters[voterIndex].voted = true
        await electionLog.save()
        return NextResponse.json({
          message: 'updated electionLog',
          status: 200,
        })
      } else {
        return NextResponse.json({ message: 'no voter found', status: 404 })
      }
    }
  } catch (error) {
    return NextResponse.json({ message: 'Network error', status: 400, error })
  }
}
