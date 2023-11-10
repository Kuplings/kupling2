// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ChatDetail = ({ match }) => {
//   const [chat, setChat] = useState(null);

//   useEffect(() => {
//     const chatId = match.params.id;
//     axios.get(`api/user/chats/${chatId}/`).then((response) => {
//       setChat(response.data);
//     });
//   }, [match]);

//   return (
//     <div>
//       {chat ? (
//         <div>
//           <h1>{chat.name}</h1>
//           <ul>
//             {chat.messages.map((message) => (
//               <li key={message.id}>{message.content}</li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default ChatDetail;

import * as React from "react";
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

export default ChatList;