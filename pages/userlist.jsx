import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../src/Api/axios";
import Header from "../src/Component/Header";
import RequestsTable from "../src/Component/RequestList";
import FriendsTable from "../src/Component/FriendList";
import ChatDrawer from "../src/Component/ChatDrawer";
import UserTable from "../src/Component/AlluserList";
import { io } from "socket.io-client";

export default function BasicTable() {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [myFriend, setMyFriend] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [message, setMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const fetchData = useCallback(async (url, setState) => {
    try {
      const response = await axiosInstance.get(url);
      setState(response.data);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching data.");
    }
  }, []);

  const handleUserData = useCallback(() => {
    if (userId) {
      fetchData(`/friends/allUser?userId=${userId}`, setData);
    }
  }, [fetchData, userId]);

  const handleUserDataMyFriend = useCallback(() => {
    if (userId) {
      fetchData(`/friends/my-friends?userId=${userId}`, (data) =>
        setMyFriend(data?.friends)
      );
    }
  }, [fetchData, userId]);

  const handleUserDataRequest = useCallback(() => {
    if (userId) {
      fetchData(`/friends/friend-requests/${userId}?status=pending`, (data) =>
        setRequestList(data)
      );
    }
  }, [fetchData, userId]);

  const sendRequest = useCallback(
    async (receiverId) => {
      if (!userId) return;
      try {
        await axiosInstance.post("/friends/requestSent", {
          senderId: userId,
          receiverId,
        });
        toast.success("Request sent successfully!");
        handleUserData();
        handleUserDataRequest();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send request.");
      }
    },
    [userId, handleUserData, handleUserDataRequest]
  );

  const acceptRequest = useCallback(
    async (requestId) => {
      try {
        await axiosInstance.post("/friends/friends/accept", { requestId });
        toast.success("Request accepted successfully!");
        handleUserDataMyFriend();
        handleUserDataRequest();
      } catch (error) {
        console.error("Network error:", error.message);
      }
    },
    [handleUserDataMyFriend, handleUserDataRequest]
  );

  const fetchUserChats = useCallback(async () => {
    if (userId && selectedFriendId) {
      try {
        const response = await axiosInstance.get(`/chat/chat/${userId}`, {
          params: { friendId: selectedFriendId },
        });
        setChatData(response.data);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    }
  }, [userId, selectedFriendId]);

  const socket = io("http://localhost:8001", {
    transports: ["websocket"],
  });

  useEffect(() => {
    if (userId) {
      socket.emit("joinChat", { userId });

      socket.on("getMessage", () => {
        fetchUserChats();
      });
      socket.on("newMessage", (newMessage) => {
        if (
          newMessage.senderId === selectedFriendId ||
          newMessage.receiverId === selectedFriendId
        ) {
          fetchUserChats();
        }
      });
    }

    return () => {
      socket.off("newMessage");
    };
  }, [userId, selectedFriendId]);

  const StartChat = useCallback(
    async (receiverId) => {
      if (!userId || !message.trim()) return;
      try {
        await axiosInstance.post("/chat/chat/send", {
          senderId: userId,
          receiverId,
          message,
        });
        const newMessage = { senderId: userId, receiverId, message };

        socket.emit("sendMessage", newMessage);
        fetchUserChats();
        setMessage("");
      } catch (error) {
        console.error("Network error:", error.message);
      }
    },
    [userId, message, fetchUserChats]
  );

  useEffect(() => {
    const friendId = localStorage.getItem("selectedFriendId");
    if (friendId) setSelectedFriendId(friendId);
  }, []);

  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  useEffect(() => {
    if (userId) {
      handleUserData();
      handleUserDataMyFriend();
      handleUserDataRequest();
    }
  }, [userId, handleUserData, handleUserDataMyFriend, handleUserDataRequest]);

  const handleChange = useCallback((_, newValue) => {
    setTabIndex(newValue);
  }, []);

  const handleChatClick = useCallback((friend) => {
    if (friend?._id) {
      localStorage.setItem("selectedFriendId", friend._id);
      setSelectedFriendId(friend._id);
    }
    setSelectedChat(friend);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={7}>
          <Box sx={{ width: "90%", p: 2, border: "1px solid #ccc" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabIndex} onChange={handleChange} aria-label="tabs">
                <Tab label="My Friends" />
                <Tab label="Friend Requests" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              {tabIndex === 0 ? (
                <FriendsTable
                  friends={myFriend}
                  handleChatClick={handleChatClick}
                />
              ) : (
                <RequestsTable
                  requests={requestList}
                  acceptRequest={acceptRequest}
                />
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={5}>
          <UserTable data={data} sendRequest={sendRequest} />
        </Grid>

        <ChatDrawer
          isDrawerOpen={isDrawerOpen}
          closeDrawer={closeDrawer}
          selectedChat={selectedChat}
          chatData={chatData}
          message={message}
          setMessage={setMessage}
          StartChat={StartChat}
          setChatData={setChatData}
          userId={userId}
        />
      </Grid>
    </>
  );
}
