import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Button,
} from "@mui/material";

const UserTable = ({ data, sendRequest }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="all users table">
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row._id}>
              <TableCell>
                <Avatar
                  alt={row.name || "No Name"}
                  src={row.profilePic || "/default-avatar.png"}
                />
              </TableCell>
              <TableCell>{row.name || "No Name"}</TableCell>
              <TableCell align="right">{row.email || "No Email"}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendRequest(row._id)}
                >
                  Send Request
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
