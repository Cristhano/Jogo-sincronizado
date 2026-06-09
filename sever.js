import express from 'express'
import http from 'http'
import CreateGame from './public/game.js'
import { Server } from 'socket.io'
import { type } from 'os'

const app = express()
const sever = http.createServer(app)
const sockets = new Server(sever)

app.use(express.static('public'))

const game = CreateGame()
let players = 0
let fruitSpawner
let intervalDeEspera

let msgcont = 1
const msgespera1 = "Esperando Jogadores."
const msgespera2 = "Esperando Jogadores.."
const msgespera3 = "Esperando Jogadores..."

game.subscribe((command) => {
    sockets.emit(command.type, command)
    sockets.emit('setup', game.state)
})

sockets.on('connection', (socket) => {
    let playerId = socket.id

    socket.on("myId", (myId) => {
        if (!myId) {
            game.addPlayer({ playerId: playerId, type: 'add-player' })
        } else {
            playerId = myId
            game.addPlayer({ playerId: playerId, type: 'add-player' })
        }
        console.log("Jogador Conectado: " + playerId)
        sockets.emit('start', ({playerId: playerId, freq: 300}))

        players += 1
        if(players === 1){
            intervalDeEspera = setInterval(() => {
                if(msgcont === 1){sockets.emit("contagem", msgespera1); msgcont += 1}else if
                (msgcont === 2){sockets.emit("contagem", msgespera2); msgcont += 1}else if
                (msgcont === 3){sockets.emit("contagem", msgespera3); msgcont = 1}
            }, 1000)
        }
        if(players === 3){
            let i = 15
            clearInterval(intervalDeEspera)
            const contagem = setInterval(() => {
                if(i === 0){
                    clearInterval(contagem)
                    sockets.emit('contagem', "Começado!")
                    fruitSpawner = setInterval(() => {game.addFruit({type: 'add-fruit'})}, 3000)
                }else{
                    i--
                    sockets.emit('contagem', "começando em: " + i)
                }
            }, 1000)
        }
    })

    socket.on('disconnect', () => {
        game.removeplayer({ playerId: playerId, type: 'remove-player' })
        players -= 1

        if(players === 0){clearInterval(fruitSpawner)}
    })
    socket.on('move-player', (command) => {
        if (command.type != 'move-player') { return }
        command.playerId = playerId

        game.movePlayer(command)
    })
    socket.on('on-death', (command) => {
        if (command.type != 'on-death') { return }
        console.log("player death: " + command.playerId)
        sockets.emit('recipe-death', command)
    })

})

sever.listen(3000, () => {
    console.log('Sever rodando na porta: 3000')
})