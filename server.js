import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({port:8080});

wss.on('connection', function connection(ws){
    ws.on('error', console.error);

    ws.on('message', function message(dados){
        console.log(`o servidor recebeu essa mensagem: %s`, dados);
        ws.send(dados)
        console.log("o servidor repasou a msg")
    });
    ws.send('Iniciando o servidor. ChatON!');
})
