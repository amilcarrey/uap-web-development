import { Router } from 'express'
import { authenticateJWT } from '../middleware/auth'
import { faucetContract } from '../utils/faucet'

const router = Router()

// Reclamar tokens
router.post('/claim', authenticateJWT, async (req, res) => {
  const { address } = req.body
  try {
    const tx = await faucetContract.claimTokens({ from: address })
    await tx.wait()
    res.json({ txHash: tx.hash, success: true })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// Estado del faucet
router.get('/status/:address', authenticateJWT, async (req, res) => {
  const address = req.params.address
  try {
    const hasClaimed = await faucetContract.hasAddressClaimed(address)
    const users = await faucetContract.getFaucetUsers()
    const balance = await faucetContract.balanceOf(address)
    res.json({ hasClaimed, users, balance: balance.toString() })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
