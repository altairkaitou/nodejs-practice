const WebSocket = require('ws');

const server = new WebSocket.Server({port: 5500});

server.on('connection', (ws) => {
    console.log("Client connected");

    ws.on('message', (message) => {
        console.log('received: %s', message);


        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        })
    })

    ws.on('close', () => {
        console.log('Client disconnected');
    });

});

