const express = require('express')

const port = process.env.PORT

const app = express()

const http = require('http')

const server = http.createServer(app)

const {Server} = require('socket.io')

const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

const io = new Server(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html')
})

var user = []

io.on('connection', (socket) => { 
    var username;
    socket.on('user-connected', data => {
        user.push(data.name)
        username = data.name
        io.emit('update-online-user', user)
        io.emit('update-user', data)
    })
    socket.on('disconnect', () => {
        if(username)
        {
            io.emit('remove-user', username)
            user.splice(user.indexOf(username), 1)
            io.emit('update-online-user', user)
        }
    })
    socket.on('on-chat', data => {
        io.emit('load-chat', data)
    })
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
