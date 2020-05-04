const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const { generateMessage, generateLocation } = require("./utils/messages")

const port = process.env.PORT
const publicDirectory = path.join(__dirname, "../public")

app.use(express.static(publicDirectory))

let count = 0;

io.on("connection", (socket) => {
  console.log("Client Connected")
  socket.emit("message", generateMessage("Welcome!"))
  socket.broadcast.emit("message", generateMessage("A New User has joined..."))

  socket.on("sendMessage", (data, callback) => {
    if(data.length > 50){
      return callback("Exceeding Characters")
    }

    io.emit("message", generateMessage(data))
    callback("Delivered")

  })

  socket.on("sendLocation", (coords, callback) => {
    io.emit("join", generateLocation(coords))
    callback("Location Shared!")
  })

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("User has left..."))
  })
})

server.listen(port, () => {
  console.log(`Server is up on PORT ${port}...`)
})
