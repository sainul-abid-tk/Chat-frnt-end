import { useState } from 'react'
import './App.css'
import io from "socket.io-client"
import Chat from './Chat'
const socket = io.connect("https://chat-server-iqjo.onrender.com")
function App() {
  const [username,setUsername]=useState("")
  const [roomId,setRoomId]=useState("")
  const [showChat,setShowChat]=useState(false)
  const joinRoom=()=>{
    if(username!=="" && roomId!==""){
      socket.emit("join_room",(roomId))
      setShowChat(!showChat)
    }
  }
  return (
    <>
      <div style={{height:'100vh'}} className='d-flex flex-column  justify-content-center align-items-center'>
        {!showChat?<div style={{width:'358px'}} className='text-center'>
          <h1 className='mb-4'>Join Chat</h1>
        <input type="text" placeholder='Username' onChange={e=>setUsername(e.target.value)} className='form-control mb-4 ' />
        <input type="text" placeholder='Room ID' onChange={e=>setRoomId(e.target.value)} className='form-control' />
        <button  onClick={joinRoom} className='btn btn-success mt-4 w-75 '>Join Room</button>
        </div>:
        <Chat socket={socket} username={username} roomId={roomId}/>}
      </div>
    </>
  )
}

export default App
