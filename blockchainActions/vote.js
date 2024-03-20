import { GetEachElectionContract } from './getEachElectionContract'

export async function Vote(candidateId, voterAddress, address) {
  try {
    const uniqueElection = await GetEachElectionContract(address)
    const transactionResponse = await uniqueElection.vote(
      candidateId,
      voterAddress
    )
    await transactionResponse.wait()
    return {
      message: 'voted',
      status: 200,
      transactionResponse,
    }
  } catch (error) {
    console.log(error)
    return {
      message: 'internal server error',
      status: 500,
      error,
    }
  }
}
