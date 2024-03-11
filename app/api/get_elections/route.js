import ElectionLog from '@/databaseModels/electionLogsSchema'
import Voter from '@/databaseModels/voterSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name } = await request.json()
    const voter = await Voter.findOne({ digitalWallet: name })
    if (voter) {
      const { voterId } = await voter

      const ongoingElections = await ElectionLog.aggregate([
        {
          $match: {
            status: true,
            voters: { $elemMatch: { voterid: voterId } },
          },
        },
        {
          $project: {
            _id: 1,
            address: 1,
            status: 1,
            electionname: 1,
            electiondescription: 1,
            voters: {
              $filter: {
                input: '$voters',
                as: 'voter',
                cond: { $eq: ['$$voter.voterid', voterId] },
              },
            },
          },
        },
      ])
      if (ongoingElections.length === 0) {
        return NextResponse.json({
          message: 'No ongoing elections found for this voter',
          status: 404,
        })
      }
      return NextResponse.json({
        message: 'Ongoing elections found',
        status: 200,
        ongoingElections,
      })
    }
    return NextResponse.json({
      message: 'Unauthorized user found',
      status: 401,
    })
  } catch (error) {
    return NextResponse.json({ message: 'Network error', status: 400, error })
  }
}
