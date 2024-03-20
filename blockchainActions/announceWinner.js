import { GetEachElectionContract } from './getEachElectionContract'

export async function Announce_winner(contractAddress) {
  try {
    const uniqueElection = await GetEachElectionContract(contractAddress)
    const winnersIds = await uniqueElection.getWinners()
    const candidates = []
    if (winnersIds.length > 0) {
      await winnersIds.map(async (candidateId) => {
        const parsedId = parseInt(candidateId)
        const winner = await uniqueElection.getCandidate(parsedId)
        candidates.push(winner)
      })
      return candidates
    }
    return {
      message: 'No winners',
      status: 500,
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
