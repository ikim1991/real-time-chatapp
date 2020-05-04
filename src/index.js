const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const { generateMessage, generateLocation } = require("./utils/messages")
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")

const port = process.env.PORT
const publicDirectory = path.join(__dirname, "../public")

app.use(express.static(publicDirectory))

let count = 0;

io.on("connection", (socket) => {
  console.log("Client Connected")

  socket.on("login", ({ username, room }, callback) => {

    const { error, user } = addUser(socket.id, username, room)

    if(error){
      return callback(error)
    }

    socket.join(user.room)
    io.to(user.room).emit("introduction", generateMessage(`${user.username} has joined...`))

    callback()
  })

  socket.on("sendMessage", (data, callback) => {

    const user = getUser(socket.id)

    if(data.length > 150){
      return callback("Exceeding Characters")
    }
    io.to(user.room).emit("message", generateMessage(data), user)
    callback()
  })

  socket.on("sendLocation", (coords, callback) => {

    const user = getUser(socket.id)
    io.to(user.room).emit("join", generateLocation(coords), user)
    callback()
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)

    if(user){
      io.to(user.room).emit("introduction", generateMessage(`${user.username} has left...`))
    }
  })
})



server.listen(port, () => {
  console.log(`Server is up on PORT ${port}...`)
})
