'use client'
import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { useAtom } from "jotai";
import { addressAtom, tokenAtom } from "../store";
import { redirect } from "next/navigation";

export default function Home() {
    const [address, setAddress] = useAtom(addressAtom);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useAtom(tokenAtom);

    const getSessionInfo = async () => {
        const res = await fetch("http://localhost:3000/me", {
            headers:{'Authorization' : `Bearer ${token}`}
         });
        const data = await res.json();
        alert(JSON.stringify(data, null, 2));
    };

    const signInWithEthereum = async () => {
        // ① Conectar MetaMask
        if (!window.ethereum) throw new Error("MetaMask no está instalado");
        const provider = new ethers.BrowserProvider(window.ethereum);

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const domain = window.location.host;
        const uri = window.location.origin


        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // ② Pedir nonce al servidor
        const nonceResponse = await fetch("http://localhost:3000/api/auth/message", {
            method: 'POST',
            body: JSON.stringify({ address }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        });

        const response = await nonceResponse.json();

        const message = new SiweMessage({
            domain,
            address,
            statement: 'Sign in to the app',
            uri,
            version: "1",
            chainId: 11155111,
            nonce: response.token,
            issuedAt: new Date().toISOString()
        })


        const signature = await signer.signMessage(message.prepareMessage());

        const verifyRes = await fetch("http://localhost:3000/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ message, signature })
        });

        if (!verifyRes.ok) throw new Error("Firma inválida");

        const result = await verifyRes.json();

        setAddress(result.address);
        setToken(result.token)
        setIsLoggedIn(true);
    }

    return (
        <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3rem" }}>
            <h1 className="p-2">🦊 Sign-In With Ethereum (SIWE)</h1>
            {!isLoggedIn ? (
                <>
                    <button onClick={signInWithEthereum} className="bg-orange-300 text-lg text-white hover:bg-orange-500 p-1 rounded-lg">Conectar y firmar</button>
                </>
            ) : (
                <>
                    <p>✅ Conectado como: {address}</p>
                    <button onClick={redirect('/prubea/claim')} className="bg-orange-300 text-lg text-white hover:bg-orange-500 p-1 rounded-lg">Comencemos!</button>
                </>
            )}
        </div>
    );
}
