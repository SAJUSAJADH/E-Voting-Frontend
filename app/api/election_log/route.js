import ElectionLog from '@/databaseModels/electionLogsSchema'
import Connect from '@/dbConfig/connect'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await Connect()
    const { name, electionName, electionDescription, action } = await request.json()
    const ElectionExist = await ElectionLog.find({ address: name })
    if (ElectionExist.length > 0) {
      for (const entry of ElectionExist) {
        if (entry.status === true && action === 'create') {
          return NextResponse.json({
            message: 'Ongoing election found',
            status: 400,
          })
        }
        if (entry.status === true && action === 'delete') {
          const deleteEntry = await ElectionLog.deleteOne({ _id: entry._id })
          return NextResponse.json({
            message: 'updated, can create new election',
            status: 200,
            deleteEntry
          })
        }
      }
    }
    const newElectionlog = new ElectionLog({
      electionname: electionName,
      electiondescription: electionDescription,
      address: name,
      status: true,
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
