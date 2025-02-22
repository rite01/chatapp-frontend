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

const RequestsTable = ({ requests, acceptRequest }) => {
  if (requests?.length === 0 || requests === undefined) {
    return <div>No Request</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="requests table">
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests?.map((row) => (
            <TableRow key={row._id}>
              <TableCell>
                <Avatar
                  alt={row?.sender?.name}
                  src={row?.sender?.profilePic || "/default-avatar.png"}
                />
              </TableCell>
              <TableCell>{row.sender.name}</TableCell>
              <TableCell align="right">{row.sender.email}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => acceptRequest(row._id)}
                >
                  Accept
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestsTable;
