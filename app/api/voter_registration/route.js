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

    const alreadyRegistered = await Voter.findOne({ voterId })

    const alreadyLinked = await Voter.findOne({ digitalWallet })

    if (alreadyRegistered) {
      return NextResponse.json({
        message: 'already registered',
        status: 405,
      })
    }

    if (alreadyLinked) {
      return NextResponse.json({
        message: 'already Linked walletAddress',
        status: 405,
      })
    }

    const newVoter = new Voter({
      name: fullname,
      voterId: voterId,
      address: address,
      state: state,
      district: district,
      city: city,
      zipCode: zipCode,
      digitalWallet: digitalWallet,
    })
    const savedVoter = await newVoter.save()
    return NextResponse.json({
      message: 'registered successfully',
      status: 200,
      savedVoter,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'Internal server error',
      status: 500,
      error,
    })
  }
}
