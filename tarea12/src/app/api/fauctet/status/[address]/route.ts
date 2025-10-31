import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import buildInfo from "../../claim/abi.json"


const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!; // clave privada del "servidor"
const RPC_URL = process.env.RPC_URL!; // por ejemplo, un nodo Infura o Alchemy

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
    try {
        const { address } = await params;

        if (!address) {
            return NextResponse.json({ error: "Missing address" }, { status: 400 });
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        const abi = buildInfo.output.contracts["claimToken.sol"].FaucetToken.abi;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

        const hasClaimed: boolean = await contract.hasAddressClaimed(address);
        const faucetAmount: bigint = await contract.getFaucetAmount();
        const faucetUsers: string[] = await contract.getFaucetUsers();

        return NextResponse.json({
            hasClaimed,
            balance: ethers.formatEther(faucetAmount) + " tokens",
            totalUsers: faucetUsers.length,
            users: faucetUsers,
        });
    } catch (error: any) {
        console.error("❌ Error en el endpoint:", error);
        return NextResponse.json(
            { success: false, error: error.reason || error.message },
            { status: 500 }
        );
    }
}