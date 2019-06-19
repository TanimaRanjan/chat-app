const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } =require('./utils/messages')
const { getUser, getUserInRoom, getUsers, addUser, removeUser } = require('./utils/users')

const app = express() 

const server = http.createServer(app)

const io = socketio(server)

const port = process.env.PORT || 3000 
const publicDir = path.join(__dirname , '../public')

app.use(express.static(publicDir))

io.on('connection', (socket) => {

    socket.on('join', ({username, room}, callback) => {

        // Add user
        const { error, user } = addUser({ id: socket.id, username, room })

        if(error) { 
            return callback(error)
        }

        socket.join(user.room)

        // io.to.emit - sends message to everyone in room
        // socket.broadcast.to.emit - sends message to everyone in room
        socket.emit('message' , generateMessage(`Welcome ${user.username} to ${user.room} chat!`))

        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`))

        callback()
    
    })

    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
       io.to('New York').emit('message', generateMessage(message))
        callback()
    })

    socket.on('shareLocation', (position, callback) => {
        io.emit('locationMessage', 
        generateMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })
    
    
    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} left the chat`))
        } 

    })
})


server.listen(port, () => console.log(`Server is up on port ${port}`));
