import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CheckCircle, Warning, Error, Info, Close } from '@mui/icons-material';
import styles from './Notification.module.css';

const Notification = ({ type, message, show }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      case 'info':
        return <Info />;
      default:
        return <Info />;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      case 'error':
        return styles.error;
      case 'info':
        return styles.info;
      default:
        return styles.info;
    }
  };

  if (!visible) return null;

  return (
    <Box className={`${styles.notificationContainer} ${getColorClass(type)}`}>
      <Box className={styles.iconContainer}>
        {getIcon(type)}
        <Box>
          <Typography variant="h6">{type === 'success' ? 'Inicio Exitoso' : type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
          <Typography>{message}</Typography>
        </Box>
      </Box>
      <IconButton className={styles.closeButton} color="inherit" onClick={() => setVisible(false)}>
        <Close />
      </IconButton>
    </Box>
  );
};

export default Notification;


