import { Router } from 'express'
import { SiweMessage } from 'siwe'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/message', (req, res) => {
  const { address } = req.body
  if (!address) return res.status(400).json({ error: 'Address required' })

  const message = new SiweMessage({
    domain: 'localhost',
    address,
    statement: 'Sign in with Ethereum to access the Faucet',
    uri: 'http://localhost:3000',
    version: '1',
    chainId: 11155111,
  })

  const jwtToken = jwt.sign({ address }, process.env.JWT_SECRET!, { expiresIn: '15m' })
  res.json({ message: message.prepareMessage(), token: jwtToken, address })
})

router.post('/signin', async (req, res) => {
  const { message, signature } = req.body
  if (!message || !signature) return res.status(400).json({ error: 'Message and signature required' })

  try {
    const siweMessage = new SiweMessage(message)
    const result = await siweMessage.verify({ signature })

    if (!result.success) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const jwtToken = jwt.sign({ address: siweMessage.address }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    res.json({ token: jwtToken, address: siweMessage.address })
  } catch (err) {
    res.status(401).json({ error: 'Invalid signature' })
  }
})


export default router
