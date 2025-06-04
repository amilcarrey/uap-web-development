// src/pages/api/tabs.ts
// Punto de entrada de la API para tableros (tabs)
import { POST as postHandler } from '../../api/tabs/POST';
import { GET as getHandler } from '../../api/tabs/GET';

export const POST = postHandler;
export const GET = getHandler;
