// components/GlobalLoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const GlobalLoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      zIndex: 1300,
    }}
  >
    <CircularProgress />
  </Box>
);

export default GlobalLoadingSpinner;
