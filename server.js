import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({port:8080});

let mensagensHistorico = []
wss.on('connection', function connection(ws){
    ws.on('error', console.error);

    // envia historico de mensagem pra quem se conecta 
    
    const historico = {
        tipo: "historico",
        mensagens: mensagensHistorico
    };
    
    ws.send('Iniciando o servidor. Chat ON!');
    
    
    ws.on('message', function message(dados){
        console.log(`o servidor recebeu essa mensagem: %s`, dados);
        
        if(dados.toString() == "/limpar"){
            mensagensHistorico.length = 0
        }
        
        mensagensHistorico.push(dados.toString())
        
        console.log("mensagens no historico: " + mensagensHistorico)
        
        wss.clients.forEach(cleinte => {
            cleinte.send(dados.toString());
        });
        
        console.log("o servidor repasou a msg")
        
    });
    ws.send(JSON.stringify(historico))
})

console.log('Server rodando na porta 8080');

