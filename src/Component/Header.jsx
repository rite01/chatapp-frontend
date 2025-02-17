import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import axiosInstance from "../Api/axios";

const Header = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userDetail, setUserDetail] = useState({
    userEmail: "",
    userName: "",
    userProfilePic: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("email");
      const userName = localStorage.getItem("name");
      const userProfilePic = localStorage.getItem("profileImage");
      setUserDetail({
        userEmail: userEmail,
        userName: userName,
        userProfilePic: userProfilePic,
      });
      setUserId(storedUserId);
    }
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(
        `/notifications/notifications/${userId}`
      );
      setNotifications(
        Array.isArray(response?.data?.notifications)
          ? response?.data?.notifications
          : []
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleNotificationClick = async (event) => {
    setAnchorEl(event.currentTarget);

    const unreadNotificationIds = notifications
      .filter((notif) => !notif.isRead)
      .map((notif) => notif._id);

    if (unreadNotificationIds.length === 0) return;

    try {
      await axiosInstance.post("/notifications/notifications/read", {
        notificationIds: unreadNotificationIds,
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          unreadNotificationIds.includes(notif._id)
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chat App
        </Typography>

        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge
            badgeContent={notifications.filter((n) => !n.isRead).length}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 300,
              maxHeight: 300,
              overflowY: "auto",
            },
          }}
        >
          {notifications.length === 0 ? (
            <MenuItem onClick={handleClose}>No new notifications</MenuItem>
          ) : (
            notifications.map((notif, index) => (
              <div key={notif._id}>
                <MenuItem onClick={handleClose}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {notif.sender?.profilePic ? (
                      <img
                        src={notif.sender.profilePic}
                        alt="Profile"
                        style={{ width: 30, height: 30, borderRadius: "50%" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {notif.sender?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}

                    <div>
                      <Typography variant="body2" fontWeight="bold">
                        {notif.sender?.name || "Unknown Sender"}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {notif.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: "block" }}
                      >
                        {new Date(notif.createdAt).toLocaleString()}
                      </Typography>
                    </div>
                  </div>
                </MenuItem>
                {index !== notifications.length - 1 && <Divider />}
              </div>
            ))
          )}
        </Menu>

        {/* User Details */}
        <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
          <Avatar
            src={userDetail.userProfilePic}
            alt={userDetail.userName}
            sx={{ width: 40, height: 40, bgcolor: "secondary.main", mr: 1 }}
          >
            {!userDetail.userProfilePic &&
              userDetail.userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body1" color="inherit">
            {userDetail.userName || "Guest"}
          </Typography>
        </Box>

        <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
