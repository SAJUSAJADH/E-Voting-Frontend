import { ethers } from 'ethers'
import { contractAddress, ElectionFactABI } from '@/binaryData/constant'

export async function getElectionContract() {
  try {
    let ethereum
    if (typeof window !== 'undefined') {
      ethereum = window.ethereum
    }
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const electionContract = new ethers.Contract(
      contractAddress,
      ElectionFactABI,
      signer
    )
    return electionContract
  } catch (error) {
    console.log(error)
    return error
  }
}
