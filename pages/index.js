import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function Home() {
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file selection
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

    // Validation
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

      const response = await fetch("http://localhost:8001/api/items/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResponseMessage(data?.message);

      if (response?.status === 200 || response?.status === 201) {
        setIsLoading(false);
        router.push("/login");
      } else {
        setError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setError(true);
      setResponseMessage("An error occurred while submitting the form.");
      setIsLoading(false);
      console.error("Submission Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Head>
        <title>User Registration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
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
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </form>

      {responseMessage && (
        <Box mt={3}>
          <Alert severity={error ? "error" : "success"}>
            {responseMessage}
          </Alert>
        </Box>
      )}
    </Container>
  );
}
