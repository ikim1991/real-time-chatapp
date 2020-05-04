const users = []

// Add New User
const addUser = (id, username, room) => {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if(!username || !room){
    return {
      error: "Username and Room are Required"
    }
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  if(existingUser){
    return {
      error: "Username is Taken"
    }
  }

  const user = {
    id,
    username,
    room
  }

  users.push(user)

  return { user }
}

// Remove User
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  if(index !== -1){
    return users.splice(index, 1)[0]
  }
}

// Get a User by ID
const getUser = (id) => {
  return users.find((user) => {
    return user.id === id
  })
}

// Get Users in a Room
const getUsersInRoom = (room) => {
  return users.filter((user) => {
    return user.room === room
  })
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
