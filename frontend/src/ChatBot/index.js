import React,{useEffect, useState,useRef} from 'react'
import './index.css'

const ChatBot = () => {
    const [showChatbot,setShowChatbot] = useState(false)
    const [msgs,setMsgs] = useState([])
    const [msg,setMsg] = useState('')
    const chatboxRef = useRef(null);

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot)
    }
    useEffect(() => {
        if(chatboxRef.current)
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    },[msgs])

    const sendMsg = () => {
        const currMsg = msg.trim() 
        if(currMsg.length===0)return;
        if(currMsg){
            setMsgs((msgs) => [...msgs,{msg: currMsg,chatBot: false}])
            setMsg('')
        }
        setTimeout(() => {
            setMsgs((msgs) => [...msgs,{msg: "OK",chatBot: true}])
        },600);
    }
    const changeInput = (e) => {
        setMsg(e.target.value)
    }
    return (
        <div className='show-chatbot'>
        <button className='chatbot-toggler' onClick={toggleChatbot}>
            <span><i class="fa-regular fa-message"></i></span>
        </button>
        
        {showChatbot && <div className='chatbot'>

            <header>
                <h2>Chatbot</h2>
            </header>
            
            <ul className='chatbox' ref={chatboxRef}>
                {msgs && msgs.map(eachMsg => {
                    if(eachMsg.chatBot){
                        return <li className='chat incoming'>
                            <span className=''>
                            <i class="fa-solid fa-robot"></i></span>
                            <p>{eachMsg.msg}</p>
                        </li>
                    }
                    else{
                        return <li className='chat outgoing'>
                            <span className=''></span>
                            <p>{eachMsg.msg}</p>
                        </li>
                    }
                })}

            </ul>
            <div className='chat-input'> 
                <input type="text" 
                className='message-input'
                placeholder="Enter a message..."
                onChange={changeInput}
                value={msg}/>
                <button id="send-btn" onClick={sendMsg}>Send</button>
            </div>
        </div>}
        </div>
    )
}


export default ChatBot