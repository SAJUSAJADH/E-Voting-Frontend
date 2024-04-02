import Voter from '@/databaseModels/voterSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { voterId } = await request.json()
    const voter = await Voter.findOneAndUpdate(
      { voterId },
      { faceAuthenticated: true },
      { new: true }
    )
    if (!voter) {
      return NextResponse.json({
        message: 'Voter not found',
        status: 404,
      })
    }

    return NextResponse.json({
      message: 'Face ID updated successfully',
      status: 200
    })
  } catch (error) {
    return NextResponse.json({
      message: 'registration failed',
      status: 500,
      error,
    })
  }
}
