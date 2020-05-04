const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $sendLocationButton = document.querySelector("#location")
const $messenger = document.querySelector("#messenger")

const formatDatetime = (date) => {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth() <= 10 ? "0" + new Date(date).getMonth() : new Date(date).getMonth()
  const day = new Date(date).getDate() <= 10 ? "0" + new Date(date).getDate() : new Date(date).getDate()
  const hour = new Date(date).getHours() <= 10 ? "0" + new Date(date).getHours() : new Date(date).getHours()
  const minute = new Date(date).getMinutes() <= 10 ? "0" + new Date(date).getMinutes() : new Date(date).getMinutes()
  return `[${year}-${month}-${day} ${hour}:${minute}]`
}

socket.on("message", (data) => {
  const message = document.createElement("p")
  message.textContent = `${formatDatetime(data.createdAt)} ${data.text}`
  $messenger.appendChild(message)
})

socket.on("join", (data) => {
  $sendLocationButton.removeAttribute("disabled")
  const location = document.createElement("a")
  const message = document.createElement("p")
  location.textContent = "My Location"
  message.textContent = `${formatDatetime(data.createdAt)} `
  location.setAttribute("href", data.url)
  location.setAttribute("target", "_blank")
  const element = $messenger.appendChild(message).appendChild(location)
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
