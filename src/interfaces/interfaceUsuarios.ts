import { z } from 'zod'

export const Usuario = z.object({
    id: z.number(),
    nome: z.string(),
    email: z.string().email(),
    senha: z.string()

})

export type usuario = z.infer<typeof Usuario>