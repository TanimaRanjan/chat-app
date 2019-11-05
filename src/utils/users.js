const users = []

// addUser, removeUser, getUser, getUserInRoom

const addUser = ({id, username, room}) => {
    
    // console.log({id, username, room})
    // clean data
    username = username.trim().toUpperCase()
    room = room.trim().toUpperCase()
    
    if(!username || !room) {
        return {
            error:'Username and Room are required !'
        }
    }
    
    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate Username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    
    // Store the user
    const user = {id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id )

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUsers = () => users

const getUser = (id) => { 
    
    const userFound = users.find(user => user.id === id )
    return userFound
}

const getUserInRoom = (room) => {

    const usersInRoom = users.filter(user => {
        return user.room === room.trim().toUpperCase()
    })
    return usersInRoom
}

module.exports = {
    getUser,
    getUserInRoom,
    getUsers,
    addUser,
    removeUser
}
