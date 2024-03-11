import { GetEachElectionContract } from './getEachElectionContract'

export async function Vote(candidateId, voterId, address) {
  try {
    const uniqueElection = await GetEachElectionContract(address)
    const success = await uniqueElection.vote(candidateId, voterId)
    console.log(success)
    if (success) {
      return {
        message: 'voted',
        status: 200,
      }
    }

    return {
      message: 'processing',
      status: 400,
    }
  } catch (error) {
    return {
      message: 'internal server error',
      status: 500,
      error,
    }
  }
}
