const socket = io()

socket.on("message", (data) => {
  document.querySelector(".messenger").textContent = data
})

socket.on("join", (data) => {
  console.log(data)
})

document.querySelector("#send").addEventListener("click", () => {
  const value = document.querySelector("#message").value
  document.querySelector("#message").value = ""
  socket.emit("sendMessage", value, (error) => {
    if(error){
      return console.log(error)
    }
    console.log("Message Delivered")
  })
})

document.querySelector("#location").addEventListener("click", () => {
  if(!navigator.geolocation){
    return alert("Geolocation not supported by Browser")
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (message) => {
      console.log(message)
    })
  })
})
