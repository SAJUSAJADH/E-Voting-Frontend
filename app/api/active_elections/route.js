import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name } = await request.json()
    const election = await ElectionLog.findOne({ address: name, status: true })
    if (election) {
      return NextResponse.json({
        message: 'Already have an election',
        status: 401,
        election,
      })
    }
    return NextResponse.json({ message: 'No active election', status: 200 })
  } catch (error) {
    return NextResponse.json({
      message: 'internal server error',
      status: 500,
      error,
    })
  }
}
