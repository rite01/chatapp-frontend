import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { SendRounded, Edit, Delete } from "@mui/icons-material";
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

  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

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

  const editMessage = async (chatId) => {
    try {
      await axiosInstance.put(`/chat/chats/${chatId}`, {
        message: editText,
      });

      setChatData(
        chatData.map((chat) =>
          chat._id === chatId ? { ...chat, message: editText } : chat
        )
      );

      setEditingMessage(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating message:", error);
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
                {editingMessage === chat._id ? (
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => setEditingMessage(null)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        editMessage(chat._id);
                      }
                    }}
                  />
                ) : (
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
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, textAlign: "right" }}
                >
                  {new Date(chat.timestamp).toLocaleString()}
                </Typography>

                {/* {chat.sender._id !== userId && chat.seen && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ mt: 0.5, textAlign: "right" }}
                  >
                    Seen
                  </Typography>
                )} */}

                <Box display="flex" gap={1} mt={0.5}>
                  {chat.sender._id === userId && (
                    <Tooltip title="Edit Message" arrow>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setEditingMessage(chat._id);
                          setEditText(chat.message);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Message" arrow>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMessage(chat._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
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
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                StartChat(selectedChat?._id);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    onClick={() => StartChat(selectedChat?._id)}
                  >
                    <SendRounded />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
