document,addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:5500');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messages = document.getElementById('messages');


    socket.addEventListener('open', () => {
        console.log('Connected to WebSocket Server');
    })


    socket.addEventListener('message', (event) => {
        const message = event.data;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messages.appendChild(messageElement);


        messages.scrollTop = messages.scrollHeight;
    })


    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            socket.send(message);
            messageInput.value = '';
        }
    })


    messageInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            sendButton.click();
        }
        message
    })
})