const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $sendLocationButton = document.querySelector("#location")
const $messenger = document.querySelector("#messenger")

socket.on("message", (data) => {
  const message = document.createElement("p")
  message.textContent = data
  $messenger.appendChild(message)
})

socket.on("left", (data) => {
  console.log(data)
})

socket.on("join", (data) => {
  $sendLocationButton.removeAttribute("disabled")
  const location = document.createElement("a")
  const message = document.createElement("p")
  location.textContent = "My Location"
  location.setAttribute("href", data)
  location.setAttribute("target", "_blank")
  $messenger.appendChild(message).appendChild(location)
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // disable
  $messageFormButton.setAttribute("disabled", "disabled")
  const message = e.target.elements.message.value

  socket.emit("sendMessage", message, (error) => {

    // enable
    $messageFormButton.removeAttribute("disabled")
    $messageFormInput.value = ""
    $messageFormInput.focus()

    if(error){
      return console.log(error)
    }
    console.log("Message Delivered")
  })
})

$sendLocationButton.addEventListener("click", (e) => {

  e.preventDefault()

  if(!navigator.geolocation){
    return alert("Geolocation not supported by Browser")
  }

  $sendLocationButton.setAttribute("disabled", "disabled")

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (message) => {
      $sendLocationButton.removeAttribute("disabled")
      console.log(message)
    })
  })
})
