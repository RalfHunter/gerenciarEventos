import { z } from 'zod';
import { Usuario } from './interfaceUsuarios';

export const Eventos = z.object({
    id: z.number(),
    nome: z.string(),
    data: z.date(),
    usuario: Usuario
})