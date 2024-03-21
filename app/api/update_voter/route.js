import Voter from '@/databaseModels/voterSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const {
      fullname,
      address,
      voterId,
      city,
      district,
      state,
      zipCode,
      digitalWallet,
    } = await request.json()
    const voter = await Voter.findOne({ voterId, digitalWallet })
    if (!voter) {
      return NextResponse.json({ message: 'unauthenticated user', status: 401 })
    }
    const updatedVoter = await Voter.findOneAndUpdate(
      { voterId, digitalWallet },
      {
        $set: {
          name: fullname,
          address,
          city,
          district,
          state,
          zipCode,
        },
      },
      { new: true }
    )
    return NextResponse.json({
      message: 'Voter details updated successfully',
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Internal server error',
      status: 500,
      error,
    })
  }
}
