// Importa o zod
import { z } from 'zod';


// Cria um objeto zod
export const Usuario = z.object({
    nome: z.string().min(3).max(25),
    email: z.string().email(),
    senha: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%¨&*()<>:?;]/)

})

// Cria um objeto do tipo zod
export type usuario = z.infer<typeof Usuario>

