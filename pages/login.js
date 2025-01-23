import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

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
      const response = await fetch("http://localhost:8001/api/items/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      setError(data?.message);
      if (data) {
        localStorage.setItem("userId", data?.user?._id);
      }
      if (response?.status === 200 || response?.status === 201) {
        router.push("/userlist");
      }
    } catch (error) {
      setResponseMessage("An error occurred while submitting the form.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>User Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign IN
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
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
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </Button>
        </Box>
        {error && (
          <Box mt={3}>
            <Alert severity={error ? "error" : "success"}>{error}</Alert>
          </Box>
        )}
      </form>
    </div>
  );
}
