import { Usuario } from "./interfaces/interfaceUsuarios";
import { Eventos } from "./interfaces/interfaceEventos";

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data/eventos.db')


function criarTabelaEvento(){
    const query = `
    CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    data DATETIME,
    usuario_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usarios(id)
    )  `

    db.run(query, (erro) => {
        if(erro) {
            console.log(`Erro ao criar a tabela: ${erro}`)
        } else {
            console.log(`Tabela criada com sucesso!`)
        }
    })
}

function criarTabelaUsuario(){
    const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT
    )
  `
  db.run(query, (erro)  => {
    if(erro){
        console.log(`Erro ao criar a tabela: ${erro}`)
    }else {
        console.log(`Tabela criada com sucesso!`)
    }
  })
}

function criarTabelaLog(){
    const query = `
        CREATE TABLE IF NOT EXISTS log(
        log_id INTEGER PRIMARY KEY,
        usuario_id INTEGER,
        acao TEXT,
        data DATETIME,

        )
    `
}

function criarTriggerLog(){
    const query = `
    CREATE TRIGGER IF NOT EXISTS 
    `
}

function adicionarUsuario(id:number, nome:string, email:string, senha:string){
    const valido = Usuario.safeParse({id, nome, email, senha})

    if(valido.success){
        console.log("Usuario válido")
    } else {
        console.log("Usuario inválido")
    }
}

//function adicionarEvento(nome:string, nome)

//criarTabelaUsuario()
//criarTabelaEvento()

import { Ruan } from "./seeds/seedsUsuarios";
//adicionarUsuario(Ruan.id, Ruan.nome, Ruan.email, Ruan.senha)