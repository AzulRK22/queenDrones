import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const DataTable = ({ routes, onSelectRoute, onDownloadRoute }) => {
  console.log("Routes prop:", routes);
  if (!routes || routes.length === 0) {
    return <Typography sx={{ mt: 2 }}>No routes available.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Route Number:</TableCell>
            <TableCell>Priority Score</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Flight Time (min)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routes.map((route, index) => (
            <TableRow key={route.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{route.priority_score}</TableCell>
              <TableCell>{route.mode}</TableCell>
              <TableCell>{route.flight_time}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onSelectRoute(route)}
                  startIcon={<map />}
                  sx={{ mr: 1 , background: "#FB8C00"}}
                >
                  View on Map
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onDownloadRoute(route)}
                  sx={{ mr: 1 , background: "#22BB55"}}
                >
                  Download WP File
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};



export default DataTable;