import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name, electionName, electionDescription, contract } =
      await request.json()
    const ElectionExist = await ElectionLog.find({ address: name })
    if (ElectionExist.length > 0) {
      for (const entry of ElectionExist) {
        if (entry.status === true) {
          return NextResponse.json({
            message: 'Ongoing election found',
            status: 400,
          })
        }
      }
    }
    const newElectionlog = new ElectionLog({
      electionname: electionName,
      electiondescription: electionDescription,
      address: name,
      contract: contract,
      status: true,
      voters: [],
    })
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
