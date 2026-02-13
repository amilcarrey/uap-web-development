const BASE_URL = 'http://localhost:3000'

export async function getSiweMessage(address: string) {
  const res = await fetch(`${BASE_URL}/auth/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  })
  return res.json()
}

export async function signinSiwe(message: string, signature: string) {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature })
  })
  return res.json()
}

export async function claimFaucet(jwt: string) {
  const res = await fetch(`${BASE_URL}/faucet/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    }
  })
  return res.json()
}

export async function getFaucetStatus(jwt: string, address: string) {
  const res = await fetch(`${BASE_URL}/faucet/status/${address}`, {
    headers: { Authorization: `Bearer ${jwt}` }
  })
  return res.json()
}
