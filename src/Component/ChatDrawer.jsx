import React, { useEffect, useRef } from "react";
import {
  Drawer,
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
} from "@mui/material";
import axiosInstance from "../Api/axios";

const ChatDrawer = ({
  isDrawerOpen,
  closeDrawer,
  selectedChat,
  chatData,
  message,
  setMessage,
  StartChat,
  setChatData,
  userId,
}) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const markMessagesAsSeen = async () => {
    if (!selectedChat?._id || !userId) return;

    try {
      await axiosInstance.post(`/chat/chat/seen/${userId}`, {
        friendId: selectedChat._id,
      });

      setChatData((prevChats) =>
        prevChats.map((chat) =>
          chat.sender._id === selectedChat._id ? { ...chat, seen: true } : chat
        )
      );
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      markMessagesAsSeen();
    }
  }, [isDrawerOpen, selectedChat]);

  const deleteMessage = async (chatId) => {
    try {
      await axiosInstance.delete(`/chat/chat/${chatId}`);
      setChatData(chatData.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
      <Box sx={{ width: 550, p: 2 }}>
        {selectedChat && (
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              alt={selectedChat?.name || "No Name"}
              src={selectedChat?.profilePic || "/default-avatar.png"}
              sx={{ mr: 2, width: 40, height: 40 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {selectedChat?.name}
            </Typography>
          </Box>
        )}

        <hr />

        <Box
          ref={chatContainerRef}
          sx={{
            height: "calc(100vh - 300px)",
            overflowY: "auto",
            mb: 2,
            paddingRight: 1,
          }}
        >
          <List>
            {chatData?.map((chat) => (
              <ListItem
                key={chat._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mb: 2,
                  alignItems:
                    chat?.sender?._id === selectedChat?._id
                      ? "flex-start"
                      : "flex-end",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor:
                      chat?.sender?._id === selectedChat?._id
                        ? "#e1f5fe"
                        : "#f1f1f1",
                    borderRadius: 2,
                    padding: "8px 12px",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  {chat.message}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, textAlign: "right" }}
                >
                  {new Date(chat.timestamp).toLocaleString()}
                </Typography>
                {chat.sender._id !== userId && chat.seen && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ mt: 0.5, textAlign: "right" }}
                  >
                    Seen
                  </Typography>
                )}
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteMessage(chat._id)}
                  sx={{ mt: 0.5 }}
                >
                  Delete
                </Button>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => StartChat(selectedChat?._id)}
            sx={{
              padding: "12px 0",
              fontWeight: "bold",
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
