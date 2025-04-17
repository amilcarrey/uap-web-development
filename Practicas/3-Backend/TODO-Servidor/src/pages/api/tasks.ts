// src/pages/api/tasks.ts

//Punto de entrada de la API
import { POST as postHandler } from '@api/tasks/POST';
import { GET as getHandler } from '@api/tasks/GET'

export const POST = postHandler;
export const GET = getHandler;
