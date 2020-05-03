const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectory = path.join(__dirname, "../public")

app.use(express.static(publicDirectory))

let count = 0;
let message = "Welcome!"

io.on("connection", (socket) => {
  console.log("Client Connected")
  socket.emit("message", message)
  socket.broadcast.emit("join", "A New User has joined...")

  socket.on("sendMessage", (data, callback) => {
    if(data.length > 10){
      return callback("Exceeding Characters")
    }

    message = data
    io.emit("message", message)
    callback("Delivered")

  })

  socket.on("sendLocation", (coords, callback) => {
    io.emit("join", `https://google.ca/maps?q=${coords.latitude},${coords.longitude}`)
    callback("Location Shared!")
  })

  socket.on("disconnect", () => {
    io.emit("join", "User has left...")
  })
})

server.listen(port, () => {
  console.log(`Server is up on PORT ${port}...`)
})
