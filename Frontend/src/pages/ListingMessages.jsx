import useWebSocket from "react-use-websocket"; 
import React, { useState } from "react"; 
// import { messageHistory, welcomeMessage, connectionStatus} from "../App"

const ListingMessages = ({ messageHistory, welcomeMessage, connectionStatus }) => {

  // const [welcomeMessage, setWelcomeMessage] = useState("");
	const { sendJsonMessage } = useWebSocket("ws://127.0.0.1:8000/");
	// const { readyState } = useWebSocket("ws://127.0.0.1:8000/", {
  //   onOpen: () => {
  //     console.log("Connected!");
  //   },
  //   onClose: () => {
  //     console.log("Disconnected!");
  //   },
	// onMessage: (e) => {
	// 	const data = JSON.parse(e.data);
	// 	switch (data.type) {
	// 		case "welcome_message":
	// 			setWelcomeMessage(data.message);
	// 			break;
	// 		case 'chat_message_echo':
	// 			setMessageHistory((prev) => prev.concat(data));
	// 			break;
	// 		default:
	// 			console.error("Unknown message type: " + data.type);
	// 			break;
	// 	}
	// }
  // });
 
  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  // }[readyState];

	const [message, setMessage] = useState("");
	const [name, setName] = useState("");

	function handleChangeMessage(e) {
		setMessage(e.target.value);
	}
	   
	  function handleChangeName(e) {
		setName(e.target.value);
	}

	function handleSubmit() {
		sendJsonMessage({
		  type: "chat_message",
		  message,
		  name
		});
		setName("");
		setMessage("");
	}  

	// const [messageHistory, setMessageHistory] = useState([]);
  
  
  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      <p>{welcomeMessage}</p>
      <input
        name="name"
        placeholder='Name'
        onChange={handleChangeName}
        value={name}
        className="shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"
      />
      <input
        name="message"
        placeholder='Message'
        onChange={handleChangeMessage}
        value={message}
        className="ml-2 shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md"
      />
      <button className='ml-3 bg-gray-300 px-3 py-1' onClick={handleSubmit}>
        Submit
      </button>
      <hr />
      <ul>
        {messageHistory.map((message, idx) => (
          <div className='border border-gray-200 py-3 px-3' key={idx}>
            {message.name}: {message.message}
          </div>
        ))}
      </ul>
      </div>
  )
}  
  
export default ListingMessages;



/* import * as React from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import Navbar from "../components/Navbar";

const ChatList = () => {
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    axios.get("api/user/chats/").then((response) => {
      setChats(response.data);
    });
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Typography variant="h4" sx={{ my: 3 }}>
          Список чатов
        </Typography>
        <List>
          {chats.map((chat) => (
            <ListItem key={chat.id}>
              <Link href={`/chat/${chat.id}`}>
                <ListItemText primary={chat.name} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default ChatList; */