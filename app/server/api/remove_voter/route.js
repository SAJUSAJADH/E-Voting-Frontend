import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { removeId, name } = await request.json()

    // Find the document based on the name
    const electionLog = await ElectionLog.findOne({
      address: name,
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

    // Check if removeId exists in the voters array
    if (!electionLog.voters.some((voter) => voter.voterid === removeId)) {
      return NextResponse.json({
        message: 'Voter does not exist in the list',
        status: 402,
      })
    }

    // Check if voter already voted
    if (
      electionLog.voters.some((voter) => {
        voter.voterid === removeId && voter.voted === true
      })
    ) {
      return NextResponse.json({ message: 'Voter already voted', status: 405 })
    }

    // Remove removeId from the voters array
    await ElectionLog.updateOne(
      { address: name },
      { $pull: { voters: { voterid: removeId } } }
    )

    return NextResponse.json({
      message: 'Voter removed successfully',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({ message: 'Network busy', status: 400, error })
  }
}
