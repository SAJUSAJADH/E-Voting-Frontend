import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name } = await request.json()
    const electionLog = await ElectionLog.findOne({
      address: name,
      status: 'true',
    })
    if (electionLog) {
      return NextResponse.json({
        message: 'data found',
        status: 200,
        electionLog,
      })
    }
    return NextResponse.json({ message: 'not found', status: 404 })
  } catch (error) {
    return NextResponse.json({ message: 'Cant get it', status: 400, error })
  }
}
