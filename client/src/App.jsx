import React, { useEffect,useMemo,useState } from 'react'
import {io} from "socket.io-client"


const App = () => {
  const socket = useMemo(() => io("http://localhost:3000",({
    withCredentials:true,
  })),[]) 

  const [message,setMessage] = useState("")
  const[room,setRoom] = useState("")
  const[socketId,setSocketId] = useState("")
  const[recievedMessage,setRecievedMessage] = useState([])
  const[roomName,setRoomName] = useState("")

  const handleSubmit = (e) => { 
   e.preventDefault()
   socket.emit("message",{message,room})
   setMessage("")
  }

  const joinRoomName = (e) => {
    e.preventDefault()
    socket.emit("join-room",roomName)
    setRoomName("")
    
  }

  useEffect(() => {
   socket.on("connect",()=>{
    setSocketId(socket.id)
     console.log("Connected to server")
   })

   socket.on("recieve-message",(message)=>{
     console.log(message)
     setRecievedMessage(prevMessages => [...prevMessages, message])
   })

   socket.on("welcome",(s)=>{
      console.log(s)
   })
   return () => {
     socket.disconnect()
   }
  },[])

  return (
    <div>
      <h1>Welcome to scoket.io!!!</h1>
      <h6>{socketId}</h6>
      <form onSubmit={joinRoomName}>
        <h5>Join Room</h5>
        <input value={roomName} type="text" label="Room Name" onChange={e=>setRoomName(e.target.value)}/>
        <button type='submit'>Join</button>
      </form>
      <form onSubmit={handleSubmit}>
        <input type="text" label="Send message...." onChange={e=>setMessage(e.target.value)}/>
        <input type="text" label="room" onChange={e=> setRoom(e.target.value)}/>
        <button type='submit'>Send</button>
      </form>
      
  
      <div>
        {recievedMessage.map((message,index)=>(
          <h6 key={index}>{message}</h6>
        ))}
      </div>
    </div>
  )
}

export default App