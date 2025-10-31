import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';
import { generateNonce } from 'siwe';

export async function POST(req: NextRequest) {
  const body = await req.json()
  const address = body.address;
  const nonce = generateNonce();

  const response = NextResponse.json({
    token: nonce,
    address: address,
  });

  response.cookies.set('nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 5, // 5 minutos
  });

  return response;
}
