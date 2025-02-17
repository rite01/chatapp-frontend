import React from "react";
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const FriendsTable = ({ friends, handleChatClick }) => {
  if (friends.length === 0) {
    return <div>No Request</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="friends table">
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {friends.map((row) => (
            <TableRow key={row.name}>
              <TableCell>
                <Avatar
                  alt={row.name}
                  src={row.profilePic || "/default-avatar.png"}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleChatClick(row)}
                >
                  Chat
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUnfriend(row._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Unfriend
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FriendsTable;
