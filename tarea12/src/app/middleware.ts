import { NextRequest, NextResponse } from "next/server";
import {jwtVerify} from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET );


export async function middleware(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, secret);
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-address", payload.address as string);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch (err) {
        return NextResponse.json({ error: "Token inválido", err }, { status: 403 });
    }
}

export const config = {
  matcher: ["/api/fauctet/*"],
  runtime: "nodejs",
};

