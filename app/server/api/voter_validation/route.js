import Voter from '@/databaseModels/voterSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name } = await request.json()
    const isFound = await Voter.findOne({ digitalWallet: name })
    if (isFound) {
      return NextResponse.json({ message: 'Voter found', status: 200, isFound })
    }
    return NextResponse.json({ message: 'not found', status: 404 })
  } catch (error) {
    return NextResponse.json({ message: 'Network busy', status: 400, error })
  }
}
