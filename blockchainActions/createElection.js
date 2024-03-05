import { getElectionContract } from './getElectioncontract'

export async function Create_election(
  address,
  electionName,
  electionDescription
) {
  const electionContract = await getElectionContract()
  const success = await electionContract.createElection(
    address,
    electionName,
    electionDescription
  )
  if (success) {
    const response = await electionContract.getDeployedElection(address)
    return response
  } else {
    const response = ['', '', 'Election creation failed']
    return response
  }
}
