// Importa o zod
import { z } from 'zod';

// cria um objeto zod
export const Evento = z.object({
    nome: z.string(),
    data: z.date(),
    usuario: z.number()
})

// Cria um tipo
export type evento = z.infer<typeof Evento>