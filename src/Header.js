import React from 'react';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import { createMockFormSubmission, onMessage, saveLikedFormSubmission } from './service/mockServer';
import { useState, useEffect } from 'react';

export default function Header() {

  const [open, setOpen] = useState(false)
  const [newDataObj, setNewDataObj] = useState({})

  const handleFormSubmission = (formData) => {
    // Handle the form data received from the server
    setOpen(true);
    setNewDataObj(formData.data)
  };

    useEffect(()=> {
      onMessage(handleFormSubmission);
    },[])

    const handleClose = () => {
      setOpen(false);
    };

    const handleLike = () => {
      saveLikedFormSubmission(newDataObj)
      .then((response) => {
        console.log(response); 
        setOpen(false);
      })
      .catch((error) => {
        console.error(error); // Handle error
      });
      
    }

    const action = (
      <>
        <Button color="primary" size="small" onClick={handleLike}>
          LIKE
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </>
    );

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{marginRight: 2}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            Toast Exercise
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => createMockFormSubmission()}
          >
            New Submission
          </Button>
        </Toolbar>
      </AppBar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        style={{whiteSpace: 'pre-line'}}
        autoHideDuration={6000}
        onClose={handleClose}
        message={newDataObj && `${newDataObj.firstName} ${newDataObj.lastName}\n${newDataObj.email}`}
        action={action}
      />
    </Box>
  );
}
