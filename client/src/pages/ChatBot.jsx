import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import icon from "../assets/icon.png";
import Sidebar from "../components/Sidebar";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const ChatContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  padding: "16px",
});

const ChatBox = styled(Box)({
  flexGrow: 1,
  overflowY: "auto",
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
});

const InputContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const TextFieldStyled = styled(TextField)({
  flexGrow: 1,
});

const MessageContainer = styled(Box)(({ theme, isUser }) => ({
  display: "flex",
  justifyContent: isUser ? "flex-end" : "flex-start",
  marginBottom: "8px",
}));

const MessagePaper = styled(Paper)(({ theme, isUser }) => ({
  padding: "10px",
  borderRadius: isUser ? "15px 15px 0 15px" : "15px 15px 15px 0",
  backgroundColor: isUser ? "#DCF8C6" : "#FFF",
  maxWidth: "60%",
  wordBreak: "break-word",
}));

const getRandomColor = () => {
  const colors = ["#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#FF5722"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { user: "User", text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/ai/generate/",
        { prompt: input },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      let botResponseText = "";
      if (Array.isArray(data)) {
        const formattedData = data.map(
          (item) =>
            `<b>NAME: </b>${item.name}. <br /> <b> DESCRIPTION:</b> ${item.description}<br /><br /> <hr>`
        );
        botResponseText = formattedData.join("");
      } else if (typeof data === "object") {
        const name = `<b>NAME:</b>  ${data.name}`;
        const description = `<b>DESCRIPTION: </b> ${data.description}`;

        botResponseText = `${name}<br />${description}<br /><br />`;
      }

      const botMessage = { user: "Bot", text: botResponseText };
      setMessages([...updatedMessages, botMessage]);

      localStorage.setItem(
        "chatMessages",
        JSON.stringify([...updatedMessages, botMessage])
      );
    } catch (error) {
      console.error("Error while generating text", error);
      const errorMessage = {
        user: "Bot",
        text: "Error: Unable to get a response.",
      };
      setMessages([...updatedMessages, errorMessage]);

      localStorage.setItem(
        "chatMessages",
        JSON.stringify([...updatedMessages, errorMessage])
      );
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{ display: "flex", height: "100vh", bgcolor: "rgb(245, 245, 245)" }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <ChatContainer>
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
          >
            <Avatar src={icon} sx={{ marginRight: 1 }} />
            ChatBot
          </Typography>

          <ChatBox sx={{ bgcolor: "white" }}>
            <List>
              {messages.map((message, index) => (
                <MessageContainer key={index} isUser={message.user === "User"}>
                  {message.user === "User" && user && (
                    <Avatar
                      sx={{
                        bgcolor: getRandomColor(),
                        fontSize: 25,
                        margin: "0 8px",
                      }}
                    >
                      {user.username && user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  {message.user === "Bot" && (
                    <Avatar src={icon} sx={{ margin: "0 8px" }} />
                  )}
                  <MessagePaper isUser={message.user === "User"}>
                    <Typography
                      variant="body1"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  </MessagePaper>
                </MessageContainer>
              ))}
              {loading && (
                <MessageContainer isUser={false}>
                  <Avatar src={icon} sx={{ margin: "0 8px" }} />
                  <MessagePaper>
                    <Typography variant="body1">Bot is typing...</Typography>
                    <CircularProgress size={24} />
                  </MessagePaper>
                </MessageContainer>
              )}
            </List>
          </ChatBox>
          <InputContainer sx={{ bgcolor: "white" }}>
            <TextFieldStyled
              placeholder="Type here..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ color: "#1976d3" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSend}>
                      <SendIcon sx={{ color: "#1976d3" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </InputContainer>
        </ChatContainer>
      </Box>
    </Box>
  );
}
