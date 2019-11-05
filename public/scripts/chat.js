const socket = io()

// Elements
const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $geoLocationButton = document.querySelector('#shareLocation')

const $messageDisplay = document.querySelector('#message')
const $sidebarDisplay = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {

    const $newMessage = $messageDisplay.lastElementChild

    const newMessageStyle = getComputedStyle($newMessage)
    const newMessgeMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight

    console.log(newMessgeMargin)
    const visibleHeight = $newMessage.offsetHeight

    // Height of messages container
    const containerHeight = $messageDisplay.scrollHeight

    const scrollOffset = $messageDisplay.scrollTop

    
    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messageDisplay.scrollTop = $messageDisplay.scrollHeight
    }
}

socket.on('message', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text, 
        createdAt:moment(message.createdAt).format('HH:mm')
    })
    $messageDisplay.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


// Location Message 
socket.on('locationMessage', ({username, url, createdAt}) => {
    console.log('Using Location message', url)
    const html = Mustache.render(urlTemplate, {
        username,
        url,
        createdAt:moment(createdAt).format('HH.mm')
    })    
    $messageDisplay.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })

    $sidebarDisplay.innerHTML = html
    // console.log(room)
    // console.log(users)
})

$messageForm .addEventListener('submit', (e)=> {
    e.preventDefault()
    // disable
    const message = e.target.elements.message.value
    $messageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('sendMessage', message, (error) => {
        //enable 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            console.log('error')    
        } else {
            console.log(`Message was delivered! ${message}`)
        }
        
    })
    
})

$geoLocationButton.addEventListener('click', (e) => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported')
    } 
    $geoLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('shareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, 
        () => {
            console.log('Location shared')
            $geoLocationButton.removeAttribute('disabled')
        })
    })
})


socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
