import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import buildInfo from "./abi.json"

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!; // clave privada del "servidor"
const RPC_URL = process.env.RPC_URL!; // por ejemplo, un nodo Infura o Alchemy

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, action } = body;
    console.log(body)

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }
    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const abi = buildInfo.output.contracts["claimToken.sol"].FaucetToken.abi;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    let tx;
    if (action === "claim") {
      tx = await contract.claimTokens();
    } else if (action === "reset") {
      tx = await contract.resetClaimStatus(address);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await tx.wait();
    console.log(`✅ Acción '${action}' ejecutada. TX: ${tx.hash}`);

    return NextResponse.json({
      success: true,
      action,
      txHash: tx.hash,
      message: `Acción '${action}' completada con éxito.`,
    });
  } catch (error: any) {
    console.error("❌ Error en el endpoint:", error);
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
