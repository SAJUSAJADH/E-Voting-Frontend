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
    const transactionResponse = await uniqueElection.addCandidate(
      String(name),
      String(description),
      String(imgHash),
      String(voterId)
    )
    await transactionResponse.wait()

    return {
      message: 'success',
      status: 200,
      transactionResponse,
    }
  } catch (error) {
    console.log(error)
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
