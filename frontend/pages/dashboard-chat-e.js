import React from "react";

import {
  Container,
  Box,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";
import ChatGPT from '../public/src/components/chatgpt'; // Ensure the casing matches the file



const DashboardChatE = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>

          <Typography variant="h4" gutterBottom>            
          

          </Typography>
          {/* Puedes agregar más contenido aquí */}
          <ChatGPT />
        </Box>
      </div>
    </div>
  );
};

export default DashboardChatE;
