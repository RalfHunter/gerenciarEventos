//importa o path para obter o caminho do arquivo
const path = require('path')
// resolve possiveis problemas com o caminho
const absolutePath = path.resolve(__dirname, 'index.js')
// cria uma propriedade para receber o caminho
let path_empty:string = ''

if (absolutePath.includes("dist")){
    path_empty = '../data/eventos.db'
}
else{
    path_empty = './data/eventos.db'
}

// agora ele atribui o valor de path_empty para o filePath
export const filePath = path_empty



import {logar, criandoUsuariosPadrao, criarTabelaEvento, criarTabelaLog, criarTabelaUsuario} from "./metodosTabelas/metodosTabelas";
import { adicionarEvento, inserirLogDelete, deletarEvento, retornarEvento } from "./metodosTabelas/metodosTabelas";
import { inserirLogInsert, atualizarEvento, showTabelas, retornarTodosEventos } from "./metodosTabelas/metodosTabelas";
import { inserirLogUpdate } from "./metodosTabelas/metodosTabelas";
import { Marco, Silvio, Ruan, Luis } from "./seeds/seedsUsuarios";
import { questionAsync, rl } from "./metodosTabelas/readline";




/*
 AVISO IMPORTANTE: UTILIZEI PROMISES E FUNÇÕES ASSÍNCRONAS POR CAUSA DO
 SQL DO BANCO DE DADOS DO SQLITE3, A FUNÇÃO PRINCIPAL TERMINAVA MAS O A FUNÇÃO DO 
 BANCO AINDA ESTAVA SENDO PROCESSADO, PARA CONTORNAR O PROBLEMA TRANSFOMEI TODAS A 
 FUNÇÕES EM ASSÍNCRONAS.
*/



// Função principal
async function main() {
    // Chama a função que verifica se as tabelas foram criadas
    const tabelas = await showTabelas()
    // Caso o length seja menor que 4 ela chama
    // os metodos para criar as tabelas
    if(tabelas.length < 4 || tabelas.undefined){
        console.log(await criarTabelaUsuario())
        console.log(await criarTabelaEvento())
        console.log(await criarTabelaLog())
        // Criar os usuários padrões
        await criandoUsuariosPadrao([Marco, Silvio, Ruan, Luis])
    }
    
    while(true){
        // Pergunta o email
        const email = await questionAsync("Informe email:\n ")
        // Pergunta a sennha
        const senha = await questionAsync("Informe a senha do email:\n")
        // Chama funçãoe verifica se as crendenciais estão corretas
        const logado = await logar(email, senha)
        // Caso estejam corretas não retornar null ou undefined
        if(logado != undefined && logado != null){
            // obtém o id de quem está logado
            const id = logado.id
            while(true){
                // Mostra as opçoes disponíveis
                console.log("O que deseja fazer?")
                console.log("Para inserir evento digite 1")
                console.log("Para deletar evento digite 2")
                console.log("Para alterar evento digite 3")
                console.log("Para buscar um evento digite 4")
                console.log("Para buscar todos os eventos digite 5")
                console.log("Para sair digite 6")
                const evento = await questionAsync("> ")
                switch(evento){
                    // Para criar um novo evento
                    case "1":{
                        // Pergunta sobre o nome do novo evento caso contrário o nome
                        // será Default
                        let nomeEvento:string = await questionAsync("Nome do Evento:\n") || "Default"
                        // Pergunta sobre o nome a data novo evento caso ele pega a atual
                        let dataEvento:Date = new Date(await questionAsync("Data do Evento exemplo(0000-00-00):\n") || new Date())
                        // Chama a função e armazena o resultado da função
                        const evento = await adicionarEvento(nomeEvento, dataEvento, id)
                        // Caso true ele faz o inserção do log insert, caso algo diferente
                        // ele ignora
                        if(evento === true){
                            await inserirLogInsert(id, "INSERT", dataEvento)
                        }
                        continue
                    // Para deletar um evento
                    }case "2":{
                        // Solicita sobre o id do Evento que deseja ser deletado
                        const idEvento = parseInt(await questionAsync("Insira o ID:\n"))
                        // Chama a função e armazena o valor
                        const resultado = await retornarEvento(idEvento)
                        // Caso o resultado não seja undefined
                        // chamas as funções responsáveis por deletar Evento
                        // e inserlog do tipo 'DELETE'
                        if(resultado != undefined){
                            await deletarEvento(idEvento)
                            await inserirLogDelete(resultado.id)
                            continue
                        // Caso contrário, retorna uma mensagem informando
                        // que nada foi encontrado 
                        }else{
                            console.log("Nenhum Evento encontrado")
                            continue
                        }
                    // Altera um evento(nome e data) 
                    }case "3":{
                        // Solicita do id Do evento
                        const idEvento = parseInt(await questionAsync("Forna o id do Evento a ser modificado:\n"))
                        // Passa o id e Chama a função
                        const resultado = await atualizarEvento(idEvento, id)
                        // Se for igual a true insere o log do tipo 'UPDATE'
                        if(resultado === true){
                            await inserirLogUpdate(id)
                        // Caso contrário apenas igonra e continua
                        }else{
                            continue
                        }
                        continue

                    // Busca por um evento
                    }case"4":{
                        // Solicita o id do evento desejado
                        const id = parseInt(await questionAsync("Informe o id do Evento:\n"))
                        // Passa o id e Chama a função
                        const evento = await retornarEvento(id)
                        // Mostra o resultado no terminal
                        console.table(evento)
                        continue
                    // Retorna todos os eventos
                    }case"5":{
                        // Chama a função e armazena o resultado
                        const eventos = await retornarTodosEventos()
                        // Mostra o resultado no terminal
                        console.table(eventos)
                        continue
                    //  Sai da função e encerra todo o processo
                    }case "6":{
                        console.log("Saindo...")
                        rl.close()
                        return
                    // Caso o valor fornecido não corresponda a nenhum dos casos
                    // mostra o que foi digitado e avisa que a opção é inválida
                    }default:{
                        console.log(`Opção inválida => ${evento} <= digite uma opção válida!!`)
                        continue
                    }
                }


            }
        }else{
            continue
        }
        
    }

}

main()