import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  Button,
  Drawer,
  Typography,
  ListItem,
  List,
  Avatar,
  TextField,
} from "@mui/material";
import Header from "./header";

export default function BasicTable() {
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [myFriend, setMyFriend] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [chatData, setChatData] = useState([]);

  // Get userId from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  const fetchData = useCallback(async (url, setState) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const responseData = await response.json();
      setState(responseData);
    } catch (error) {
      setResponseMessage("An error occurred while fetching the data.");
    }
  }, []);

  const handleUserData = useCallback(() => {
    if (userId) {
      fetchData(
        `http://localhost:8001/api/items/allUser?userId=${userId}`,
        setData
      );
    }
  }, [fetchData, userId]);

  const handleUserDataMyFriend = useCallback(() => {
    if (userId) {
      fetchData(
        `http://localhost:8001/api/items/my-friends?userId=${userId}`,
        (data) => setMyFriend(data?.friends)
      );
    }
  }, [fetchData, userId]);

  const handleUserDataRequest = useCallback(() => {
    if (userId) {
      fetchData(
        `http://localhost:8001/api/items/friend-requests/${userId}?status=pending`,
        (data) => setRequestList(data?.data)
      );
    }
  }, [fetchData, userId]);

  const sendRequest = useCallback(
    async (receiverId) => {
      if (!userId) return;
      try {
        const response = await fetch(
          "http://localhost:8001/api/items/requestSent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderId: userId, receiverId }),
          }
        );
        console.log("Request sent successfully:", await response.json());
        handleUserDataRequest(); // Fetch the updated request list
      } catch (error) {
        console.error("Network error:", error.message);
      }
    },
    [userId, handleUserDataRequest]
  );

  const acceptRequest = useCallback(
    async (requestId) => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/items/friends/accept",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId }),
          }
        );
        console.log("Request accepted successfully:", await response.json());
        handleUserDataMyFriend(); // Fetch updated friends
        handleUserDataRequest(); // Fetch updated request list
      } catch (error) {
        console.error("Network error:", error.message);
      }
    },
    [handleUserDataMyFriend, handleUserDataRequest]
  );

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const [selectedFriendId, setSelectedFriendId] = useState(null);

  // Load selectedFriendId from localStorage on the client side
  useEffect(() => {
    const friendId = localStorage.getItem("selectedFriendId");
    if (friendId) {
      setSelectedFriendId(friendId);
    }
  }, []);

  const fetchUserChats = useCallback(async () => {
    try {
      if (userId && selectedFriendId) {
        const response = await fetch(
          `http://localhost:8001/api/items/chat/${userId}?friendId=${selectedFriendId}`
        );
        const data = await response.json();
        setChatData(data);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  }, [userId, selectedFriendId]);

  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  // Update selectedFriendId in local storage and state
  const handleChatClick = useCallback((friend) => {
    if (friend?._id) {
      localStorage.setItem("selectedFriendId", friend._id);
      setSelectedFriendId(friend._id);
    }

    setSelectedChat(friend);
    setIsDrawerOpen(true);
  }, []);

  useEffect(() => {
    if (userId) {
      handleUserData();
      handleUserDataMyFriend();
      handleUserDataRequest();
    }
  }, [userId, handleUserData, handleUserDataMyFriend, handleUserDataRequest]);

  const handleChange = useCallback((event, newValue) => {
    setTabIndex(newValue);
  }, []);

  const friendsTable = useMemo(
    () => (
      <TableContainer component={Paper}>
        <Table aria-label="friends table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myFriend?.map((row) => (
              <TableRow key={row?.name}>
                <TableCell>{row?.name}</TableCell>
                <TableCell align="right">{row?.email}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleChatClick(row)}
                  >
                    Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ),
    [myFriend, handleChatClick]
  );

  const requestsTable = useMemo(
    () => (
      <TableContainer component={Paper}>
        <Table aria-label="requests table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestList?.map((row) => (
              <TableRow key={row?.sender?.name}>
                <TableCell>{row?.sender?.name}</TableCell>
                <TableCell align="right">{row?.sender?.email}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => acceptRequest(row?._id)}
                  >
                    Accept
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ),
    [requestList, acceptRequest]
  );

  const StartChat = useCallback(
    async (receiverId) => {
      if (!userId || !message.trim()) return; // Check if userId exists and message is not empty
      try {
        const response = await fetch(
          "http://localhost:8001/api/items/chat/send",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderId: userId, receiverId, message }),
          }
        );
        console.log("Message sent successfully:", await response.json());
        fetchUserChats(); // Fetch the new messages immediately
        setMessage(""); // Clear the message input
      } catch (error) {
        console.error("Network error:", error.message);
      }
    },
    [message, userId, fetchUserChats]
  );

  return (
    <>
      <Header />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={7}>
          <TableContainer component={Paper}>
            <Table aria-label="all users table">
              <TableHead>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row) => (
                  <TableRow key={row?._id}>
                    <TableCell>
                      <Avatar
                        alt={row?.name || "No Name"}
                        src={row?.profilePic || "/default-avatar.png"}
                      />
                    </TableCell>
                    <TableCell>{row?.name || "No Name"}</TableCell>
                    <TableCell align="right">
                      {row?.email || "No Email"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => sendRequest(row?._id)}
                      >
                        Send Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={5}>
          <Box sx={{ width: "90%", p: 2, border: "1px solid #ccc" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabIndex} onChange={handleChange} aria-label="tabs">
                <Tab label="My Friends" />
                <Tab label="Friend Requests" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              {tabIndex === 0 ? friendsTable : requestsTable}
            </Box>
          </Box>
        </Grid>

        <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
          <Box sx={{ width: 350, p: 2 }}>
            {/* Header Section: Profile Image and Name */}
            {selectedChat && (
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  alt={selectedChat?.name || "No Name"}
                  src={selectedChat?.profilePic || "/default-avatar.png"}
                  sx={{ mr: 2, width: 40, height: 40 }} // Ensure avatar is consistently sized
                />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {selectedChat?.name}
                </Typography>
              </Box>
            )}

            {/* Chat Messages Section */}
            <Box
              sx={{
                height: "calc(100vh - 300px)", // Ensuring chat messages take up most of the drawer space
                overflowY: "auto",
                mb: 2,
                paddingRight: 1, // Add space on the right for messages
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
                        chat.sender._id === selectedChat?._id
                          ? "flex-end"
                          : "flex-start", // Align based on sender/receiver
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor:
                          chat.sender._id === selectedChat?._id
                            ? "#e1f5fe"
                            : "#f1f1f1", // Different background for sender/receiver
                        borderRadius: 2,
                        padding: "8px 12px",
                        maxWidth: "80%", // Restrict message width
                        wordBreak: "break-word", // Prevent overflow in long words
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
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Message Input Section */}
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
      </Grid>
    </>
  );
}
