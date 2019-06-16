const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('Count has been update  '+count)
// })
socket.on('message', (message) => {
    console.log(message)
})


document.querySelector('#messageTag').addEventListener('submit', (e)=> {
    e.preventDefault()
    // console.log(e.target[0].value)
    // document.querySelector('input').value    
    // const city = e.target[0].value
    const city = e.target.elements.message.value
    socket.emit('sendMessage', city)
})



// document.querySelector('#increment').addEventListener(('click'), () => {
//     // count ++;
//     console.log('clicked')
//     socket.emit('increment')
// })