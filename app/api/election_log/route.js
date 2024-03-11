import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { address, electionName, electionDescription } = await request.json()
    const EmailExist = await ElectionLog.find({ address })
    const newElectionlog = new ElectionLog({
      electionname: electionName,
      electiondescription: electionDescription,
      address: address,
      status: true,
    })
    if (EmailExist.length > 0) {
      for (const entry of EmailExist) {
        if (entry.status === true) {
          return NextResponse.json({
            message: 'Ongoing election found',
            status: 400,
          })
        } else {
          const user = await entry.updateOne({ status: 'true' })
          return NextResponse.json({
            message: 'updated, can create new election',
            status: 200,
            user,
          })
        }
      }
    }
    const savedLog = await newElectionlog.save()
    return NextResponse.json({
      message: 'can create new election',
      status: 200,
      savedLog,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: 'Failed to log data.',
      status: 400,
      error,
    })
  }
}
