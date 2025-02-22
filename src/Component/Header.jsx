import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Avatar,
  Modal,
  Paper,
  Divider,
  TextField,
} from "@mui/material";
import { Menu as MenuIcon, Edit as EditIcon } from "@mui/icons-material";
import axiosInstance from "../Api/axios";

const Header = ({ userId }) => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState({
    userEmail: "",
    userName: "",
    userProfilePic: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("email");
      const userName = localStorage.getItem("name");
      const userProfilePic = localStorage.getItem("profileImage");
      setUserDetail({ userEmail, userName, userProfilePic });
    }
  }, []);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setPreviewImage("");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("userId", userId);

    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const response = await axiosInstance.post("/auth/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.user;
      localStorage.setItem("name", updatedUser.name);
      localStorage.setItem("profileImage", updatedUser.profilePic);
      setUserDetail({
        userEmail: userDetail.userEmail,
        userName: updatedUser.name,
        userProfilePic: updatedUser.profilePic,
      });
      handleModalClose();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewImage(URL.createObjectURL(file));
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

        <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
          <Avatar
            src={userDetail.userProfilePic}
            alt={userDetail.userName}
            sx={{ width: 40, height: 40, bgcolor: "secondary.main", mr: 1 }}
          >
            {!userDetail.userProfilePic &&
              userDetail.userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="body1"
            color="inherit"
            onClick={handleModalOpen}
            sx={{ cursor: "pointer" }}
          >
            {userDetail.userName || "Guest"}
          </Typography>
        </Box>

        <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
          Logout
        </Button>
      </Toolbar>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 4,
            minWidth: 400,
            maxWidth: 600,
            width: "100%",
            borderRadius: 3,
            boxShadow: 5,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editMode ? "Edit Profile" : "User Details"}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box position="relative" display="flex" justifyContent="center">
            <img
              src={previewImage || userDetail.userProfilePic}
              alt="Profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            {editMode && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: "30%",
                  bgcolor: "white",
                  borderRadius: "50%",
                  boxShadow: 2,
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <EditIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
            )}
          </Box>

          {editMode ? (
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2, mt: 5 }}
              placeholder={userDetail.userName || "N/A"}
            />
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 5 }}>
              <strong>Name:</strong> {userDetail.userName || "N/A"}
            </Typography>
          )}

          <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
            <strong>Email:</strong> {userDetail.userEmail || "N/A"}
          </Typography>

          {editMode ? (
            <Button
              onClick={handleUpdate}
              sx={{ mt: 3, width: "100%" }}
              variant="contained"
              color="secondary"
            >
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              sx={{ mt: 3, width: "100%" }}
              variant="contained"
              color="secondary"
            >
              Edit Profile
            </Button>
          )}

          <Button
            onClick={handleModalClose}
            sx={{ mt: 2, width: "100%" }}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </AppBar>
  );
};

export default Header;
