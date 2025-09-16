import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../db';
import { Usuario } from '../../models/Usuario';

const SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const mail = body?.mail;
        const contraseña = body?.contraseña;
        if (!mail || !contraseña) {
            return NextResponse.json({ error: 'Faltan datos de login' }, { status: 400 });
        }
        const usuario = await Usuario.findOne({ mail });
        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
        }
        if (usuario.contraseña !== contraseña) {
            return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
        }
        const token = jwt.sign(
            { mail: usuario.mail },
            SECRET,
            { expiresIn: '1d' }
        );
        const cookieOptions = [
            `token=${token}`,
            'Path=/',
            'HttpOnly',
            'Max-Age=86400',
            'SameSite=Strict'
        ];
        if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
        }
        const response = NextResponse.json({ ok: true });
        response.headers.set('Set-Cookie', cookieOptions.join('; '));
        return response;
    } catch (error: any) {
        console.error('Error en login:', error?.message, error);
        return NextResponse.json({ error: error?.message || 'Error interno en login', detalle: error }, { status: 500 });
    }
}