import express from 'express'
import http from 'http'
import CreateGame from './public/game.js'
import { Server } from 'socket.io'

const app = express()
const sever = http.createServer(app)
const sockets = new Server(sever)

app.use(express.static('public'))

const game = CreateGame()

game.subscribe((command) => {
    sockets.emit(command.type, command)
    sockets.emit('setup', game.state)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id

    console.log('Jogador conectado no servidor com o id: ' + playerId)

    game.addPlayer({ playerId })

    socket.on('disconnect', () => {
        console.log('Jogador desconectado:', playerId)
        game.removeplayer({playerId:playerId})
    })
    socket.on('move-player', (command) => {
        command.type = 'move-player'
        command.playerId = playerId

        game.movePlayer(command)
    })
})

sever.listen(1650, () => {
    console.log('Sever rodando na porta: 1650')
})