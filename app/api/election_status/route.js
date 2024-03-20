import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name, contract, action } = await request.json()
    const Election = await ElectionLog.findOne({
      address: name,
      contract: contract,
    })
    if (Election && action === 'check') {
      return NextResponse.json({ status: 205, updatedElection: Election })
    }
    if (Election && action === 'update') {
      await ElectionLog.updateOne(
        { address: name, contract: contract },
        { $set: { status: false } }
      )
      const updatedElection = await ElectionLog.findOne({
        address: name,
        contract: contract,
      })
      return NextResponse.json({ status: 200, updatedElection })
    }
    return NextResponse.json({ message: 'Network error', status: 400, error })
  } catch (error) {
    return NextResponse.json({
      message: 'Internal server error',
      status: 500,
      error,
    })
  }
}
