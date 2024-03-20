import { getElectionContract } from './getElectioncontract'

export async function Create_election(name, electionName, electionDescription) {
  try {
    const electionContract = await getElectionContract()
    const transactionResponse = await electionContract.createElection(
      name,
      electionName,
      electionDescription
    )

    // Wait for the transaction to be mined
    await transactionResponse.wait()

    return {
      message: 'success',
      status: 200,
      transactionResponse,
    }
  } catch (error) {
    console.error('Error creating election:', error)
    return {
      message: 'Election creation failed',
      status: 400,
      error,
    }
  }
}
