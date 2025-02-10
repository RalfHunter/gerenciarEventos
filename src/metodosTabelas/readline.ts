import * as readline from "readline"

export const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

export function questionAsync(query:any): Promise<any>{
    return new Promise((resolve) => {
        rl.question(query, (input:any) =>{
            //rl.close()
            resolve(input);
        });
    });
}
