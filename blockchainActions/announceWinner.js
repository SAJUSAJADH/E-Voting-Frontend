import { GetEachElectionContract } from "./getEachElectionContract"


export async function Announce_winner(contractAddress){
    try {
        const uniqueElection = await GetEachElectionContract(contractAddress)
        const response = await uniqueElection.getWinners()
        return response
    } catch (error) {
        console.log(error)
        return{
            message: 'internal server error',
            status: 500,
            error,
        }
    }
}