import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axiosInstance from "../src/Api/axios";
import { ChatAppImageSignUp } from "../src/assets";
import Image from "next/image";
import { getCroppedImage } from "../src/Croper/getCroppedImage";
import ImageCropper from "../src/Croper/ImageCropper";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
    profilePicPreview: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setIsCropperOpen(true); // Open cropper
    }
  };

  // Handle cropped image
  const handleCropComplete = async (croppedAreaPixels) => {
    const croppedImage = await getCroppedImage(
      selectedImage,
      croppedAreaPixels
    );
    const croppedImageUrl = URL.createObjectURL(croppedImage);

    setUserData((prev) => ({
      ...prev,
      profilePic: croppedImage,
      profilePicPreview: croppedImageUrl,
    }));

    setIsCropperOpen(false); // Close cropper after selection
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setResponseMessage("");
    setIsLoading(true);

    if (!userData.name || !userData.email || !userData.password) {
      setError(true);
      setResponseMessage("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);

      if (userData.profilePic) {
        formData.append("profilePic", userData.profilePic);
      }

      const response = await axiosInstance.post("/auth/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponseMessage(response.data?.message || "Registration successful.");
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        router.push("/login");
      } else {
        setError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setError(true);
      setResponseMessage(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Head>
        <title>User Registration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#E3F2FD",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src={ChatAppImageSignUp}
          alt="Sign Up Illustration"
          layout="intrinsic"
          width={450}
          height={450}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 4,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            padding: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Fill in the details to create your account.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />

            <Box display="flex" flexDirection="column" alignItems="center">
              <input
                type="file"
                accept="image/*"
                id="profile-pic"
                hidden
                onChange={handleFileChange}
              />
              <label htmlFor="profile-pic">
                <Button variant="contained" component="span" color="secondary">
                  Upload Profile Picture
                </Button>
              </label>

              {userData.profilePicPreview && (
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <Avatar
                    src={userData.profilePicPreview}
                    alt="Profile Preview"
                    sx={{ width: 100, height: 100 }}
                  />
                </Box>
              )}

              {/* Cropper Dialog */}
              <ImageCropper
                open={isCropperOpen}
                image={selectedImage}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={isLoading}
              size="large"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>

          <Box mt={3}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Button
                  variant="text"
                  fullWidth
                  size="small"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </Box>

          {responseMessage && (
            <Box mt={3}>
              <Alert severity={error ? "error" : "success"}>
                {responseMessage}
              </Alert>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
