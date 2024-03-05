import { GetEachElectionContract } from './getEachElectionContract'

export async function add_Candidate(
  contract,
  name,
  voterId,
  imgHash,
  description
) {
  try {
    const uniqueElection = await GetEachElectionContract(contract)
    const success = await uniqueElection.addCandidate(
      String(name),
      String(description),
      String(imgHash),
      String(voterId)
    )
    if (success) {
      return {
        status: 200,
        message: 'success',
      }
    }
    return {
      status: 205,
      message: 'processing',
    }
  } catch (error) {
    return {
      status: 400,
      message: 'Failed',
    }
  }
}

export async function Get_candidates(contract, number) {
  try {
    const uniqueElection = await GetEachElectionContract(contract)
    let candidates = []
    for (let i = 0; i < number; i++) {
      const candidate = await uniqueElection.getCandidate(i)
      candidates.push(candidate)
    }
    return candidates
  } catch (error) {
    const candidates = []
    return candidates
  }
}
