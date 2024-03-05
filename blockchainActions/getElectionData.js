import { GetEachElectionContract } from './getEachElectionContract'

export async function GetElectionDetails(contract) {
  const uniqueElection = await GetEachElectionContract(contract)
  const response = await uniqueElection.getElectionDetails()
  return response
}

export async function GetNumberofParticipants(contract) {
  const uniqueElection = await GetEachElectionContract(contract)
  let response = []
  response[0] = await uniqueElection.getNumOfCandidates()
  response[1] = await uniqueElection.getNumOfVoters()

  return response
}
