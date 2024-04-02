import Voter from '@/databaseModels/voterSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name } = await request.json()
    const voter = await Voter.findOne({ digitalWallet: name })
    if (!voter) {
      // Voter not found, return 404 status code
      return NextResponse.json({ message: 'Voter not found', status: 404 })
    }

    if (voter.faceAuthenticated) {
      // Face authentication is true, return "validated"
      return NextResponse.json({ message: 'face validated', status: 200, id: voter.voterId})
    } else {
      // Face authentication is false, return voterId
      return NextResponse.json({
        message: 'Not validated',
        status: 200,
        id: voter.voterId,
      })
    }
  } catch (error) {
    return NextResponse.json({ message: 'Network error', status: 500, error })
  }
}
