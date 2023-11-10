// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ChatList = () => {
//   const [chats, setChats] = useState([]);

//   useEffect(() => {
//     axios.get("api/user/chats/").then((response) => {
//       setChats(response.data);
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Список чатов</h1>
//       <ul>
//         {chats.map((chat) => (
//           <li key={chat.id}>
//             <a href={`/chat/${chat.id}`}>{chat.name}</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChatList;

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