import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { Alert, Box, Button, TextField, Typography, Grid } from "@mui/material";
import axiosInstance from "../src/Api/axios";
import { ChatAppImageSignUp } from "../src/assets";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState();

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      const data = response.data;

      if (data?.message) {
        setError(data.message);
      }

      if (data?.user?._id) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("profileImage", data.user.profilePic);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Login Successful!", {
          position: "top-center",
          autoClose: 5000,
        });
        router.push("/userlist");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred while logging in."
      );
    }
  };

  const handleSignUp = () => {
    router.push("/");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Head>
        <title>User Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            Sign In
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
            >
              Submit
            </Button>
          </Box>

          {error && (
            <Box mt={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="text"
                  fullWidth
                  size="small"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="text"
                  fullWidth
                  size="small"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>

      <ToastContainer />
    </Grid>
  );
}
