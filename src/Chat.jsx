import React, { useEffect, useState ,useRef} from 'react'
import ScrolltoBottom from 'react-scroll-to-bottom'
import wtspSent from '../src/assets/images/watsp-sent.png'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
function Chat({socket,username,roomId}) {
    const [currentMessage,setCurrentMessage]=useState("")
    const [messageList,setMessageList]=useState([])
    const [emojiShow,setEmojiShow]=useState(false)
    const menuRef=useRef()
    let sentMessage=async()=>{
        if(currentMessage!==""){
            let today =new Date()
            let timeStamp = new Intl.DateTimeFormat('en-us',{hour:'2-digit',minute:'2-digit'}).format(today)
            const messageData={
                roomId:roomId,
                author:username,
                message:currentMessage,
                time:timeStamp
            }
            await socket.emit("send_message",messageData)
            setMessageList((list)=>[...list,messageData]);
            setCurrentMessage("")
            setEmojiShow(false)
        }
    }
     useEffect(()=>{
        socket.on("receive_message",(data)=>{
            setMessageList((list)=>[...list,data]);
         })
         socket.on("recive_user",(data)=>{
             alert(`${data} is joined !!!`)
         })
         socket.on("left_user",(data)=>{
            alert(`${data} is Left !!!`)
         })
         const handler=(e)=>{
            if(!menuRef.current.contains(e.target)){
                setEmojiShow(false)
            }
         }
         document.addEventListener("mousedown",handler)
         return()=>{
            document.removeEventListener("mousedown",handler)
          }
    },[socket])

  return (
   <>
   <div  className='picker' ref={menuRef}>
   {emojiShow&&
    <Picker data={data} previewPosition="none" onEmojiSelect={(e)=>{
        setCurrentMessage(prev=>prev+e.native)
    }}/>
    }
   </div>
   <div style={{width:'358px'}} className='border border-2 shadow rounded-2  mb-5'>
   <div className='header d-flex  align-items-center bg-primary  text-white rounded-top-2  px-2'>
   <i  class="fa-solid fa-circle text-danger fa-beat"></i>&nbsp;&nbsp;
    <h5 className='mt-2'>Live Chat </h5>
   </div>
   <div className='ChatBody px-1 py-1'  style={{height:'500px'}} >
   <ScrolltoBottom className='message-container'>
    {
        messageList.map((messageContent,index)=>(
            <>
            <div key={index} id={username===messageContent.author?'you':'other'}>
                <div className='message'>
            <div className='message-content'>
                <p id={username!==messageContent.author?'message-author':'none'}>{messageContent.author}</p>
                <p className='message-text'>
                {messageContent.message}
                </p>
                <p className='message-meta'>{messageContent.time}</p>
            </div>
            </div>
            </div>
            </>
        ))
    }
    </ScrolltoBottom>
   </div>
   <div className='footer d-flex'>
    <button  onClick={()=>setEmojiShow(!emojiShow)} className='btn btn-white'><i class="fa-regular fa-face-smile fs-5 "></i></button>
    <input type="text" value={currentMessage} onChange={e=>setCurrentMessage(e.target.value)} placeholder='Write something...' className='form-control' onKeyPress={e=>{e.key=='Enter' &&sentMessage()}} />
    <button onClick={sentMessage} className='btn btn-info'><img src={wtspSent} width={30} alt="" /></button>
   </div>
   </div>
   </>
  )
}

export default Chat