import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "../../auth";

const Navbar = async () => {
    const session = await auth();
    return (
        <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={100} height={100} />
                </Link>
                
                <div className="flex items-center gap-5">
                    {session && session?.user ? (
                        <>
                            <Link href="/startup/create">
                                <span>Create</span>
                            </Link>
                            <form action={async () => {
                                "use server";
                                await signOut({ options: { redirectTo: "/" } });
                            }}>
                                <button type="submit">
                                    <span>Log Out</span>
                                </button>
                            </form>
                            <Link href={`/user/${session?.id}`}>
                                <span>{session?.user?.name}</span>
                            </Link>
                        </>
                    ) : (
                        <form action={async () => {
                            "use server";
                            await signIn({ provider: `github` });
                        }}>
                            <button type="submit">
                                Login
                            </button>
                        </form>

                    )}
                </div>
            </nav>
        </header>
    )
};

export default Navbar;

