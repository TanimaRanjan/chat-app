const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage} =require('./utils/messages')

const app = express() 

const server = http.createServer(app)

const io = socketio(server)

const port = process.env.PORT || 3000 
const publicDir = path.join(__dirname , '../public')

app.use(express.static(publicDir))

io.on('connection', (socket) => {
    // console.log('Server : New Socket connection')
    socket.emit('message' , generateMessage('Welcome !'))

    socket.broadcast.emit('message', generateMessage('New User has joined the chat'))

    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
       io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('shareLocation', (position, callback) => {
        io.emit('locationMessage', 
        generateMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })
    
    socket.on('disconnect', () => {
        console.log('Server : Someone disconnected')
        io.emit('message', generateMessage('Someone left the chat'))
    })
})


server.listen(port, () => console.log(`Server is up on port ${port}`));
