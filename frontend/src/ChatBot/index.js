import React,{useEffect, useState,useRef} from 'react'
import './index.css'

const latestTechnologies = [
    'React.js',
    'Node.js',
    'Express.js',
    'GraphQL',
    'TypeScript',
    'Docker',
    'Kubernetes',
    'AWS (Amazon Web Services)',
    'GCP (Google Cloud Platform)',
    'Azure',
    'Machine Learning',
    'Blockchain',
    'Serverless Computing',
    'CI/CD (Continuous Integration/Continuous Deployment)',
    'Microservices Architecture',
  ];

  const defaultQuestions = [
    "What is your name?",
    "How are you today?",
    "Where are you from?",
    "What is your favorite color?"
  ];

  const defaultAnswers = {
    "What is your name?": "My name is Chatbot.",
    "How are you today?": "I'm just a bot, so I don't have feelings, but thanks for asking!",
    "Where are you from?": "I exist in the digital realm, so I'm everywhere and nowhere at the same time.",
    "What is your favorite color?": "I don't have eyes to see colors, but I like all colors equally!"
  };


const ChatBot = () => {
    const [showChatbot,setShowChatbot] = useState(false)
    const fixed = defaultQuestions.map(each => {
        return {
            msg: each,
            chatBot: true,
            fix: true,
        }
    })
    const [msgs,setMsgs] = useState(fixed)
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
            const keywords = ['current technologies', 'latest technologies', 'job'];
            const containsKeywords = keywords.some(keyword =>
                currMsg.toLowerCase().includes(keyword)
            );
            if(containsKeywords){
                setMsgs((msgs) => [...msgs,{msg: "Here are some of the technologies that can help you get a job: ",chatBot: true}])
                setMsgs((msgs) => [...msgs,{msg: latestTechnologies,chatBot: true}])
            }
            else{
                setMsgs((msgs) => [...msgs,{msg: "OK",chatBot: true}])
            }
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
                <h2><i class="fa-solid fa-robot"></i>&nbsp;&nbsp;AbhiBot</h2>
            </header>

            
            
            <ul className='chatbox' ref={chatboxRef}>
                {msgs && msgs.map(eachMsg => {
                    
                    if(eachMsg.chatBot){
                        return <li className='chat incoming'>
                            {
                            <span className=''>
                            <i class="fa-solid fa-robot"></i></span>}
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