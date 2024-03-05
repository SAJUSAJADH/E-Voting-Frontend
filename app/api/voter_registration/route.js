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
    const isRegistered = await Voter.findOne({ voterId })
    const isWalletLinked = await Voter.findOne({ digitalWallet })
    if (isRegistered) {
      const query = { voterId: voterId }
      const update = {
        name: fullname,
        address: address,
        city: city,
        district: district,
        state: state,
        zipCode: zipCode,
      }
      const updatedVoter = await Voter.updateOne(query, update)
      return NextResponse.json({
        message: 'already registered',
        status: 205,
        updatedVoter,
      })
    }
    if (isWalletLinked) {
      return NextResponse.json({ message: 'already linked', status: 405 })
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
    return NextResponse.json({ message: 'Network error', status: 400, error })
  }
}
