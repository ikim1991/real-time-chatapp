const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $sendLocationButton = document.querySelector("#location")
const $messenger = document.querySelector("#messenger")
const $sidebar = document.querySelector(".chat__sidebar")
const $title = document.createElement("h3")
const $userTitle = document.createElement("h4")
$title.classList.add("room-title")
$userTitle.classList.add("list-title")
$sidebar.appendChild($title)
$sidebar.appendChild($userTitle)
const $usersDiv = document.createElement("div")
$sidebar.appendChild($usersDiv)
$usersDiv.classList.add("users")

const formatDatetime = (date) => {
  const year = new Date(date).getFullYear()
  const month = new Date(date).getMonth() <= 10 ? "0" + new Date(date).getMonth() : new Date(date).getMonth()
  const day = new Date(date).getDate() <= 10 ? "0" + new Date(date).getDate() : new Date(date).getDate()
  const hour = new Date(date).getHours() <= 10 ? "0" + new Date(date).getHours() : new Date(date).getHours()
  const minute = new Date(date).getMinutes() <= 10 ? "0" + new Date(date).getMinutes() : new Date(date).getMinutes()
  return `[${year}-${month}-${day} ${hour}:${minute}]`
}

const parseLocation = (query) => {
  const parameters = query.replace("?", "").split("&")
  return {
    username: parameters[0].replace("username=", ""),
    room: parameters[1].replace("room=", "")
  }
}

const { username, room } = parseLocation(location.search)

const autoscroll = () => {
  if($messageFormInput === document.activeElement){
    let scrollValue = $messenger.scrollHeight - $messenger.offsetHeight
    $messenger.scrollBy(0, scrollValue)
  }
}

socket.on("introduction", (data) => {
  const message = document.createElement("p")
  message.textContent = `${formatDatetime(data.createdAt)} ${data.text}`
  message.classList.add("admin")
  $messenger.appendChild(message)
  autoscroll()
})

socket.on("message", (data, user) => {
  const message = document.createElement("p")
  const userName = document.createElement("p")
  userName.classList.add("admin")
  userName.textContent = `${formatDatetime(data.createdAt)} ${user.username}`
  message.textContent = `${data.text}`
  $messenger.appendChild(userName)
  $messenger.appendChild(message)
  autoscroll()
})

socket.on("join", (data, user) => {
  $sendLocationButton.removeAttribute("disabled")
  const url = document.createElement("a")
  const userName = document.createElement("p")
  userName.classList.add("admin")
  url.classList.add("link")
  url.textContent = "My Location"
  userName.textContent = `${formatDatetime(data.createdAt)} ${user.username}`
  url.setAttribute("href", data.url)
  url.setAttribute("target", "_blank")
  $messenger.appendChild(userName)
  $messenger.appendChild(url)
  $messageFormInput.focus()
  autoscroll()
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
      return alert(error)
    }
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
    }, () => {
      $sendLocationButton.removeAttribute("disabled")
    })
  })
})

socket.emit("login", { username, room }, (error) => {
  if(error){
      alert(error)
      location.href = "/"
  }
  console.log("User Successfully Created...")
  $title.textContent = room
})

socket.on("roomData", ({ room, users }) => {
  $userTitle.textContent = "Users"
  $usersDiv.innerHTML = ""
  for(user of users){
    let p = document.createElement("p")
    p.textContent = user.username
    $usersDiv.appendChild(p)
  }
  $sidebar.appendChild($usersDiv)
})
