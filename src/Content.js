import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { fetchLikedFormSubmissions, onMessage, saveLikedFormSubmission } from './service/mockServer';

export default function Content() {
  const [likedData, setLikedData] = useState([])
  const [open, setOpen] = useState(false)
  const [newDataObj, setNewDataObj] = useState({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const getLikedData = () => {
    setLoading(true);
    fetchLikedFormSubmissions()
      .then((response) => {
        const submissions = response.formSubmissions;
        setLikedData(submissions);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error); // Handle error
        setError(error.message);
        setLoading(false);
      });
  }

  const handleLike = () => {
    saveLikedFormSubmission(newDataObj)
    .then((response) => {
      console.log(response); 
      setOpen(false);
      getLikedData()
    })
    .catch((error) => {
      console.error(error); // Handle error
      setError(error.message);
    });
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmission = (formData) => {
    // Handle the form data received from the server
    setOpen(true);
    setNewDataObj(formData.data)
  };


  useEffect(() => {
    getLikedData()
  },[])
  
  //Listen to formSubmission and handleit
  useEffect(()=> {
    onMessage(handleFormSubmission);
  },[])

  // SnackBar Action for LIKE
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
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      <Typography variant="body1" sx={{fontStyle: 'italic', marginTop: 1}}>
        TODO: List of liked submissions here (delete this line)
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
      <Typography variant="body1" color="error">
        Error: {error}
      </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {likedData && likedData.map((value, idx) => (
          <ListItem
            key={idx}
            disableGutters
          >
            <ListItemText primary={`${value.firstName} ${value.lastName}`}/>
            <ListItemText primary={value.email} />
          </ListItem>
          ))}
        </List>
      )}
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
