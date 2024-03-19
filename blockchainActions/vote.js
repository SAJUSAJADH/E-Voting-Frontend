import { GetEachElectionContract } from './getEachElectionContract'

export async function Vote(candidateId, voterAddress, address) {
  try {
    const uniqueElection = await GetEachElectionContract(address)
    const success = await uniqueElection.vote(candidateId, voterAddress)
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
