import { GetEachElectionContract } from './getEachElectionContract'

export async function End_Election(contractAddress) {
  try {
    const uniqueElection = await GetEachElectionContract(contractAddress)
    const transactionResponse = await uniqueElection.endElection()
    await transactionResponse.wait()
    return {
      message: 'success',
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
