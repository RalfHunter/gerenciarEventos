import { Usuario } from "../interfaces/interfaceUsuarios";
import { db } from "./metodosTabelas";

// Função para cadastrarUsuário
export async function cadastrarUsuário(nomeUsuario: string, emailUsuario: string, senhaUsuario: string) {
    const query = `INSERT INTO usuarios(nome, email, senha)
    VALUES(?, ?, ?)`
    const validar = Usuario.safeParse({nome:nomeUsuario, email:emailUsuario, senha:senhaUsuario})
    if(!validar.success){
        console.log(`Erro ao validar usuário ${validar.error}`)
        return 
    }

    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) => {
            db.run(query,[nomeUsuario, emailUsuario, senhaUsuario], erro =>{
                if(erro){
                    reject(`Erro ao criar usuário: ${erro.message}`)
                }else{
                    resolve(`Sucesso ao criar usuário`)
                }
            })
        })
    }
    return await execucao()
}

export async function deletarUsuario(idUsuario:number) {
    const query = `DELETE FROM usuarios WHERE usuarios.id = ?`
    
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.run(query, [idUsuario], erro =>{
                if(erro){
                    reject(`Ocorreu um erro ao deletar Usuário`)
                }else{
                    resolve(`Sucesso ao deletar usuario`)
                }
            })
        })
    }
    return await execucao()
}

export async function listarUsuario(idUsuario:number) {
    const query = `SELECT * FROM usuarios WHERE usuarios.id = ?`

    const execucao = async(): Promise <any> => {
        return new Promise((resolve, reject) =>{
            db.get(query, [idUsuario], function (erro, row) {
                if(erro){
                    reject(`Erro ao buscar usuário: ${erro}`)
                }else if(row != undefined && row != null){
                    console.log("Usuário encontrado")
                    resolve(row)
                }else{
                    resolve(`Nenhum usuário encontrado`)
                }
            })
        })
    }
    return execucao()
}

export async function  listarTodosUsuarios() {
    const query = `SELECT * FROM usuarios`

    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.all(query,function(erro, rows) {
                if(erro){
                    reject(`Erro ao listar todos os usuarios: ${erro}`)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    return execucao()
}