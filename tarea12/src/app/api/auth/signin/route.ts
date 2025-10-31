import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import jws from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const body = await req.json() 
  const signature = body.signature
  const siweMessage = new SiweMessage(body.message);
  const fields = await siweMessage.verify({ signature });
  const nonceSaved =  req.cookies.get('nonce')?.value

  if(fields.data.nonce !== nonceSaved) return NextResponse.json({message: 'Nonce Invalido'});

  const secretKey = process.env.JWT_SECRET || 'mi-clavesisima-secure';

  const payload = {
    address: fields.data.address,
    issuedAt: fields.data.issuedAt,
    nonce: fields.data.nonce,
  }

  const token = jws.sign(payload, secretKey, {expiresIn: "1h"});
  const address = fields.data.address
  
  return NextResponse.json({ok: true, token: token, address: address})


}
