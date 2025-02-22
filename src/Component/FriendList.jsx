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
          </TableRow>
        </TableHead>
        <TableBody>
          {friends.map((row) => (
            <TableRow key={row.name} onClick={() => handleChatClick(row)}>
              <TableCell>
                <Avatar
                  alt={row.name}
                  src={row.profilePic || "/default-avatar.png"}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FriendsTable;
