import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let mensagensHistorico = [];
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  // envia historico de mensagem pra quem se conecta

  const historico = {
    tipo: "historico",
    mensagens: mensagensHistorico,
  };

  ws.on("message", function message(dados) {
    console.log(`o servidor recebeu essa mensagem: %s`, dados);
    // implemetação de ping pong padrão do websocket pra manter a conexão dos clientes com o servidor.
    if (dados == "ping") {
      return;
    }

    if (dados.toString().endsWith("/limpar")) {
      mensagensHistorico.length = 0;
      return;
    }
    wss.clients.forEach((cleinte) => {
      if (cleinte.readyState === WebSocket.OPEN) {
        // verifico se a conexão do cliente ainda é valida, assim não envio pra absolutamente todos, só pros ativos
        cleinte.send(dados.toString());

        // para que a mensagem de "entrou no server não se matenha no historico". o ideial seria que a mensagem tivesse um tipo, tipo "msg do server" assim, não teria problema se o usuario digitasse exatamente essa
        if (dados.toString().includes("entrou na sala!")) return;
        mensagensHistorico.push(dados.toString());
      }
    });

    console.log("mensagens no historico: " + mensagensHistorico);

    console.log("o servidor repasou a msg");
  });
  ws.send(JSON.stringify(historico));
});

console.log("Server rodando na porta 8080");
// atualizar