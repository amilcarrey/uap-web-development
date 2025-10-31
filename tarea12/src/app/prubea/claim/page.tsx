'use client'
import { useEffect, useState } from "react";
import { toast } from 'sonner'
import { useAtom, useAtomValue } from "jotai";
import { addressAtom, tokenAtom } from "@/app/store";

export default function Claimea() {
    const address = useAtomValue(addressAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [contractBalance, setContractBalance] = useState('');
    const [users, setUsers] = useState<string[]>([])

    const getSessionInfo = async () => {
        const res = await fetch("http://localhost:3000/api/fauctet/claim", {
            credentials: "include",
        });
        const data = await res.json();
        alert(JSON.stringify(data, null, 2));
    };


    const claimTokens = async (action: 'claim' | 'reset') => {
        try {
            const response = await fetch('http://localhost:3000/api/fauctet/claim',
                {
                    method: 'POST',
                    body: JSON.stringify({ address, action }),
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                }
            )

            const result = await response.json()

            if (!response.ok) throw new Error(await result)
            toast("✅ Tokens reclamados con éxito!");
            action === 'claim' ? setHasClaimed(true) : setHasClaimed(false)
        } catch (err: any) {
            if (err.reason.includes("has already claimed")) {
                toast.error("⚠️ Ya reclamaste tus tokens.",  err);
            } else {
                console.error( err);
                toast.error("Error al reclamar tokens.",  err);
            }
        }
    }


    useEffect(() => {
        const status = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/fauctet/status/${address}`);
                const data = await response.json();
                console.log(data)
                setHasClaimed(data.hasClaimed);
                setContractBalance(data.balance);
                setUsers(data.users)

            } catch (err: any) {
                if(err.status === 403) toast.error('no estas autenticado')
                console.error(err)
            }
        }
        status()
    }, [])
    return (
        <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3rem" }}>
            <h1 className="p-2">🦊 Claimea tus tokens</h1>
            {hasClaimed ? (
                <>
                    <p>✅ Conectado como: {address}</p>
                    <button onClick={getSessionInfo}>Ver sesión</button>
                    <div className="flex justify-center bg-orange-200">
                        <p>Info</p>
                        <p>Balance del Contrato: {contractBalance}</p>
                        <p>Usuarios:</p>
                        {
                            users.map((u) => {
                                return <p key={u}>{u}</p>
                            })
                        }
                    </div>
                    <button onClick={() => claimTokens('reset')} className="bg-orange-300 text-lg text-white hover:bg-orange-500 p-1 rounded-lg">Reset tokens</button>
                </>
            ) : (
                <>
                    <button onClick={() => claimTokens('claim')} className="bg-orange-300 text-lg text-white hover:bg-orange-500 p-1 rounded-lg">Claimear tokens</button>
                </>
            )}
        </div>
    );
}

