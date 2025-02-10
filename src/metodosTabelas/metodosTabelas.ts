
// Importa os modulos necessários
import { questionAsync, rl } from "./readline";
import sqlite3 from 'sqlite3';
import { usuario, Usuario } from "../interfaces/interfaceUsuarios";
import { Evento } from "../interfaces/interfaceEventos";
import { filePath } from "..";
export const db = new sqlite3.Database(filePath)



// Verifica se as tabelas já não existem
export async function showTabelas() {
    // Consulta SQL
    const query = `SELECT name FROM sqlite_master WHERE type='table';`
    // Cria uma função Assíncrona que faz uma pesquisa que retornar todas as tabelas
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject)=>{
            db.all(query, function(erro, rows) {
                if(erro){
                    // Caso erro
                    reject(`Erro ao executar busca por tabelas`)
                }else if(rows != undefined && rows != null) {
                    // Se não retornar vaziou ou nulo retornar o resultado
                    resolve(rows)
                }
            })
        })
    }
    // Chama a função assincrona
    return await execucao()
    
}
// Cria a tabela eventos
export async function criarTabelaEvento(){
    // Cria tabela Eventos caso não exista
    const query = `
    CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    data DATE NOT NULL,
    usuario_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usarios(id)
    )  `

    // Função assíncrona para criar a tabela
    const run = async (): Promise <any> =>{
        return new Promise((resolve, reject) =>{ db.run(query, (erro) => {
        if(erro) {
            // Caso um erro ocorra
            reject(`Erro ao criar tabela Eventos: ${erro.message}`)
        } else {
            // Caso nenhum erro ocorra
            resolve(`Tabela Eventos criada com sucesso!`)
            
        }
    })})}
    // Chama a função assincrona
    return await run()
}

// Cria a Tabela usuarios
export async function criarTabelaUsuario(){
    // Caso a tabela não exista cria a tabela usuarios
    const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT
    )
  `
//   Função assíncrona para criar a tabela
 const execucao = async(): Promise<string> =>{
    return new Promise((resolve, reject) =>{
        db.run(query, erro =>{
            if(erro){
                // Caso um ocorra um erro
                reject(`Erro ao criar tabela Usuarios: ${erro.message}`)
            }else{
                // Se tudo ocorrer bem, retorna mensagem de sucesso
                resolve(`Tabela Usuarios criada com sucesso`)
                
            }
        })
    })

  }
// Chama função assíncrona
  return await execucao()
}

// Cria tabela de logs
export async function criarTabelaLog(){
    // Caso a tabela de logs não exista, cria a tabela de logs
    const query = `
        CREATE TABLE IF NOT EXISTS logs(
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        acao TEXT,
        data DATE)
    `
    // Função assíncrona para criar a tabela
    const execucao = async(): Promise<any>=>{
        return new Promise((resolve, reject) =>{
            db.run(query, erro =>{
                if(erro){
                    // Caso um erro ocorra retorna a mensagem de erro
                    reject(`Erro ao criar tabela Log: ${erro.message}`)
                }else {
                    resolve(`Sucesso ao criar tabela Log`)
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()
}

// Faz inserção de dados na tabela log para ações que insira um 
// evento na tabela eventos 'INSERT INTO'
export async function inserirLogInsert(usuarioId: number, acao:string, data:Date){
    // Codigo sql para realizar inserção
    const query = `
    INSERT INTO logs(usuario_id, acao, data )
    VALUES (?, ?, ?)
    `
    // Cria função assíncrona para realizar inserção de dados
    const execucao = async(): Promise <any> => {
        return new Promise((resolve, reject) =>{
            db.run(query,[usuarioId, acao, data], erro =>{
                if(erro){
                    // Caso um erro ocorra retorna uma mensagem de erro
                    reject(`Erro ao registrar Log do tipo INSERT: ${erro.message}`)
                }else {
                    // Caso ocorra tudo certo informa que um log foi adicionado
                    resolve(`Log adicionado a tabela logs`)
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()
}
// Faz a inserção de dados na tabela log para as ações de deletar um evento 'DELETE'
export async function inserirLogDelete(idUsuario: number) {
    // Código sql para realizar o inserção de um log com ação de 'DELETE'
    const query = `
    INSERT INTO logs(usuario_id, acao, data)
    VALUES (?, 'DELETE', ?)
    `
    // Função assíncrona para realizar a inserção de dados na tabela logs com ação 'DELETE'
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.run(query, [idUsuario, new Date()], erro =>{
                if(erro){
                    // Caso ocorra um erro, ele retorna uma mensagem com o erro
                    reject(`Erro ao inserir log DELETE: ${erro.message}`)
                }else {
                    resolve(`Sucesso ao inser log DELETE`)
                }
            })
        })
    }
    // Chama a função assíncrona
    return execucao()
}
// Faz a inserção de dados na tabela log para as ações de atualizar um evento 'UPDATE'
export async function inserirLogUpdate(idUsuario: number) {
    // Código sql
    try{
    const query = `INSERT INTO logs(usuario_id, acao, data)
    VALUES (?, ?, ?)`
// Cria uma função assíncrona
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject)=>{
            db.run(query,[idUsuario, 'UPDATE', new Date()], erro => {
                // Caso aconteça um erro
                if(erro){
                    // Caso ocorra um erro retorna uma mensagem ao usuário
                    reject(`Erro ao inserir log do tipo UPDATE: ${erro.message}`)
                }else {
                    // Informa que a operação foi um sucesso
                    resolve(`Sucesso ao inserir log do tipo UPDATE`)
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()}
    catch(error){
        console.log(error)
    }
}

// Função para chamada adicionarUsuario
// Ela é chamada automaticamente e usa os
// usuario criado na pasta seeds no seedsUsuarios.ts
// para adicionar usuário pré-criados
export async function adicionarUsuario(usuario:usuario){
    // Valida os dados dos usuários
    const valido = Usuario.safeParse(usuario)
    // Caso a mensagem não seja de sucesso a função retorna imediatamente
    if(!valido.success){
        return 
    }
    // SQL para inserir usuários
    const query = `
    INSERT INTO usuarios (nome, email, senha) VALUES
    (?, ?, ?)
    `
    // Função assíncrona para inserir usuários
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.run(query, [usuario.nome, usuario.email, usuario.senha], function (erro) {
                if(erro){
                    // Caso ocorra um erro ele retorna uma mensagem com o erro ocorrido
                    reject(`Erro ao inserir usuário: ${erro.message}`)
                } else {
                    // Caso tudo ocorra bem ele informa que a operação foi um sucesso
                    resolve(`Sucesso ao inserir usuário!`)
                }
            })
        })
    }
    // Chama a função assíncrona
    await execucao()
}

// Função responsável por adicionar eventos recebendo 3 parametros para realizar o mesmo
export async function adicionarEvento(nomeEvento:string, dataEvento: Date, idUsuario: number){

//    Valida os parametros passados
    const valido = Evento.safeParse({nome:nomeEvento, data:dataEvento, usuario:idUsuario})
    // se a resposta não for sucesso ele false juntamente com uma mensagem de erro
    if(!valido.success){
        console.log(`Erro ${valido.error.message}`)
        return false
    }
    // Código sql para inserir eventos 
    const query = `INSERT INTO eventos(nome, data, usuario_id)
    VALUES (?, ?, ?)`
    // Função assíncrona para chamar o código
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.run(query,[nomeEvento, dataEvento, idUsuario], (erro) =>{
                if(erro){
                    // Caso de erro ele retorna uma mensagem com o erro
                    reject(`Houve um erro ao criar o evento: ${erro.message}`)
                } else {
                    // caso dê sercer ele avisa que criar evento foi um sucesso juntamente
                    // com um valor true como resposta
                    console.log("Sucesso ao criar evento")
                    resolve(true)
                    
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()
}

// Função para deletar evento que recebe o id do evento com parametro
export async function deletarEvento(idEvento:number) {
    // Código sql para realizar o 'DELETE'
    const query = `DELETE FROM eventos WHERE id = ?`
// Função assíncrona para realizar a operação de deletar um evento
    const execucao = async(): Promise <any> => {
        return new Promise((resolve, reject)=>{
            db.run(query,[idEvento], erro =>{
                if(erro){
                    // Caso ocorra um erro retorna uma mensagem de erro
                    reject(`Erro ao deletar Evento ${erro.message}`)
                }else{
                    // Caso ocorra tudo certo, informa que deletar o evento foi um sucesso
                    resolve(`Sucesso ao deletar Evento!`)
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()
    
}
// Função que faz o 'UPDATE' nos eventos e recebe como
export async function atualizarEvento(idEvento:number, idUsuario: number) {
    // Utiliza a função retornarEvento para primeiro verificar se existe
    // Um evento com o id passado
    try{
    const resultado  = await retornarEvento(idEvento)
    if(resultado === undefined){
        console.log(`Evento com id ${idEvento} fornecido não existe!!!`)
        return false
    }
    // Código sql
    const query = 'UPDATE eventos set nome = ?, data = ?, usuario_id = ? WHERE id = ?'
    // Pergunta o novo nome e a nova data do evento
    const novoNome = await questionAsync("Novo nome:") || resultado.nome
    const novaData = new Date(await questionAsync("Nova data: ") || resultado.data) 
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.run(query,[novoNome, novaData, idUsuario, idEvento], erro =>{
                if(erro){
                    // Caso ocorra um erro retorna uma mensagem identificando o erro
                    reject(`Erro ao modificar evento: ${erro.message}`)
                }else{
                    // Caso de tudo certo informa o usuário do sucesso
                    console.log(`Evento modificado com sucesso!`)
                    resolve(true)
                }
            })
           
        })
    }
    // Chama a função assíncrona
    return await execucao()}
    catch(err){
        console.log(`Provavelmente ouve a tentativa de insirir um valor inválido no campo data\n ${err}`)
        
    }
}
    


// Função que recebe a lista de usuário Defaults que será criado
export async function criandoUsuariosPadrao(usuarios:usuario[]){
    // Código sql
    const query = `SELECT * FROM usuarios WHERE usuarios.email = ?`
    // Cria uma propriedade do tipo usuario
    let resultado: usuario[] = []
    // Cria uma função assíncrona para executar o sql
    const getResults = async (usuario:usuario):Promise<any> => { return new Promise((resolve, reject) => {
        db.get(query, [usuario.email],  (erro, rows) => {
            if (erro) {
                // Caso um erro ocorra retorna uma mensagem informando o usuário
                reject(`Erro ao pesquisar usuários: ${erro.message}`)
            } else if(rows != undefined) {
                // Caso ele retorn diferente de undefined significa que o usuário já existe
                resolve(null)
            }else {
                // caso retorne undefined significa que esse usuário ainda não existe
                // no banco de dados
                resolve(usuario)
                
            }
        })
    })}
    // for que passa cada um dos usuário para a função assíncrona
    for(let i: number = 0; i < usuarios.length; i++) {
        const item = await getResults(usuarios[i])
        if (item != null){
        // Salvando o resultado numa lista
        resultado.push(item)
        }
    }
    // for responsável por criar os usuário de resultado
    // que são aqueles não encontrados durante a consulta sql
    for(let u: number = 0; u < resultado.length; u++) {
        // Finalmente adiciona os usuários
        await adicionarUsuario(resultado[u])
       

    }
    // Informa que foi um sucesso a criação dos usuários
    console.log("Usuarios Criados")
    
}

// Função que realiza a bus de um evento pelo id
export async function retornarEvento(idEvento:number) {
    // Codigo sql
    const query = `SELECT * FROM eventos WHERE eventos.id = ?`
    // Função assíncrona
    const execucao = async(): Promise <any> => {
        return new Promise((resolve, reject) =>{
            db.get(query, [idEvento], function(erro, row) {
                if(erro){
                    // Caso um erro ocorra retorna uma mensagem ao usuário
                    reject(`Erro ao listar Evento: ${erro.message}`)
                }else if(row != undefined){
                    // Informa que o evento foi encontrada
                    // E por fim retorna a row
                    console.log("Evento encontrado!")
                    resolve(row)
                    return row
                }else {
                    // Caso nada seja encontrado retorna undefined
                    resolve(undefined)
                    return undefined
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()
}

// Função para listar todo os eventos
export async function retornarTodosEventos() {
    // Codigo SQL
    const query = `SELECT * FROM eventos`
// Função assíncrona para executar a consulta
    const execucao = async(): Promise <any> =>{
        return new Promise((resolve, reject)=>{
            db.all(query, function(erro, rows){
                if(erro){
                    // Caso um erro ocorra, retorna uma mensagem de erro para o usuario
                    reject(`Erro ao retornar itens da tabela: ${erro.message}`)
                }else if(rows != undefined && rows != null){
                    // Caso tenha resposta na busca que não seja um null e nem undefined
                    // retorna o resultado
                    resolve(rows)
                }else{
                    // Caso nada seja encontrado retorna a mensagem avisando que nada foi
                    // encontrado
                    resolve(`Nenhum resultado encontrado`)
                }
            })
        })
    }
    // Chama a função assíncrona
    return await execucao()
}

// Função responsável para que o usuário possa fazer login
export async function logar(email:string, senha:string) {
    // Código sql para realizar consulta
    const query = 'SELECT * FROM usuarios WHERE usuarios.email = ? and usuarios.senha = ?'

    // Função assíncrona para realizar a consulta
    const login = async(): Promise <any> =>{
        return new Promise((resolve, reject) =>{
            db.get(query, [email, senha], function(erro, row) {
                if(erro){
                    // Caso ocorra um erro retorna a mensagem ao usuário
                    reject(`Erro na tentativa de login: ${erro.message}`)
                }else if(row != undefined){
                    // Caso o resultado seja diferente de undefined
                    // retorna o resultado
                    resolve(row)
                }else {
                    // Aqui também retorna o resultado
                    // acompanhado de uma mensagem que não foi 
                    // possível encontrar o usuário
                    console.log("Usuário não encontrado")
                    resolve(row)
                    }
                    })
        })
    }
    // Chama a função assíncrona
    return await login()
}

