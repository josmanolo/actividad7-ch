const server = io().connect();

const renderMsg = (msgs) => {
    const chat = document.querySelector("#chat");
    const chatMessages = msgs.map(msg => {
        return `<p>
                    <span>${msg.user}</span>
                    <span>${msg.date}</span>
                    <span>${msg.text}</span>
                </p>`
    });

    chat.innerHTML = chatMessages.join(' ');
}

const sendProduct = () => {
    const name = document.querySelector("#name").value;
    const price = document.querySelector("#price").value;
    const thumbnail = document.querySelector("#url").value;

    const product = {name, price, thumbnail};
    server.emit('new-product', product);
    console.log(product)
}

const sendMessage = () => {
    const user = document.querySelector("#user").value;
    const text = document.querySelector("#chat-message").value;
    const date = new Date().toLocaleString('es');

    const message = { user, text, date };
    server.emit('new-message', message);
    console.log(message)
} 

server.on('new-message-server', messages => {
    renderMsg(messages);
})