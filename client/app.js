const io = require('socket.io-client')

let socket = io.connect('/download/video')

socket.on('data-downloading', (data) => {
    console.log(data)
})