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
} from "@mui/material";
import axiosInstance from "../src/Api/axios";
import { ChatAppImageSignUp } from "../src/assets";
import Image from "next/image";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
  });

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

  // Handle file input changes
  const handleFileChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      profilePic: e.target.files[0],
    }));
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setResponseMessage(response.data?.message || "Registration successful.");
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        router.push("/login"); // Redirect to login page
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
      console.error("Submission Error:", error);
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

      {/* Left side: Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "lightblue",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Image
          src={ChatAppImageSignUp}
          alt="Sign Up Illustration"
          layout="intrinsic"
          width={500}
          height={500}
        />
      </Grid>

      {/* Right side: Form */}
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
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            gutterBottom
            align="center"
          >
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
            <TextField
              label="Profile Picture"
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleFileChange}
              fullWidth
            />
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

          {responseMessage && (
            <Box mt={3}>
              <Alert severity={error ? "error" : "success"}>
                {responseMessage}
              </Alert>
            </Box>
          )}

          <Box mt={3}>
            <Button
              variant="text"
              fullWidth
              size="small"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
