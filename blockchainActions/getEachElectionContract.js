import { ethers } from 'ethers'
import { ElectionABI } from '@/binaryData/constant'

export async function GetEachElectionContract(address) {
  try {
    let ethereum
    if (typeof window !== 'undefined') {
      ethereum = window.ethereum
    }
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const electionContract = new ethers.Contract(address, ElectionABI, signer)
    return electionContract
  } catch (error) {
    console.log(error)
  }
}
