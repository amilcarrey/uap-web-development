'use client'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login() {

    const handleLogin = async (formData: FormData) => {
        "use server";
        const dataF =
        {
            correo: formData.get('correo')?.toString(),
            password: formData.get('contraseña')?.toString()
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login',
                {
                    method: "POST",
                    body: JSON.stringify(dataF),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                }
            )
            if (!response.ok) throw new Error('Fallo en el login')
            const data: { token: string, idUsuario: string } = await response.json();
            const token = data.token;

            const cookiesStore = await cookies();
            cookiesStore.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24
            });

            redirect('/home')

        } catch (err) {
                console.error("Errores de validación:", err);
                // err.issues es un array con los errores específicos de cada campo
            
        }
    }

    return (
        <div className="bg-[#406db0] h-screen">
            <div className="w-full flex justify-center text-5xl p-5 font-extrabold text-white">
                <p>Bienvenido!</p>
            </div>
            <section className="h-20"></section>
            <div className="flex justify-center p-4 gap-2">
                <div className="p-5 bg-white">
                    <form action={handleLogin} className="flex-col flex justify-center gap-4">
                        <p>Login</p>
                        <input type="text" placeholder="Correo" className="w-max" required name="correo" />
                        <input type="text" placeholder="Contraseña" className="w-max" required name="contraseña" />
                        <button className="hover:bg-[#406db0] rounded-sm" type="submit">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
} 