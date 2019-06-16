const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express() 

const server = http.createServer(app)

const io = socketio(server)

let count = 0

const port = process.env.PORT || 3000 
const publicDir = path.join(__dirname , '../public')

app.use(express.static(publicDir))

io.on('connection', (socket) => {
    console.log('New Socket connection')
    socket.emit('message', 'Welcome!!!') 

    socket.on('sendMessage', (city) => {
        console.log(`I got it ${city}`)
        io.emit('message', city)
    })


    // socket.emit('countUpdated', count)
    // socket.on('increment', ()=> {
    //     count++
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })
})



server.listen(port, () => console.log(`Server is up on port ${port}`));
