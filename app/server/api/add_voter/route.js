import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { voterId, name, contract } = await request.json()

    // Find the document based on the name
    const electionLog = await ElectionLog.findOne({
      address: name,
      contract: contract,
    })

    if (!electionLog) {
      return NextResponse.json({
        message: 'Election log not found',
        status: 404,
      })
    }

    if (electionLog.status === false) {
      return NextResponse.json({ message: 'Election closed', status: 405 })
    }

    // Check if voterId exists in the voters array
    if (electionLog.voters.some((voter) => voter.voterid === voterId)) {
      return NextResponse.json({
        message: 'Voter already exists in the list',
        status: 402,
      })
    }

    // Add voterId to the voters array
    electionLog.voters.push({ voterid: voterId, voted: false })

    // Save the updated document
    await electionLog.save()

    return NextResponse.json({
      message: 'Voter added successfully',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({ message: 'Network busy', status: 400, error })
  }
}
