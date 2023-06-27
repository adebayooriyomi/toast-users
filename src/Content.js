import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { fetchLikedFormSubmissions, onMessage, saveLikedFormSubmission } from './service/mockServer';

export default function Content() {
  const [likedData, setLikedData] = useState([])
  const [open, setOpen] = useState(false)
  const [newDataObj, setNewDataObj] = useState({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Data from LocalStorage
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
        setError("An error occurred on the server. Please refresh your browser.");
        setLoading(false);
      });
  }

  //Handle Like Button on Snackbar
  const handleLike = () => {
    saveLikedFormSubmission(newDataObj)
    .then((response) => {
      console.log(response); 
      setOpen(false);
      getLikedData()
    })
    .catch((error) => {
      console.error(error); // Handle error
      setError("An error occurred on the server. Please refresh your browser.");
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
  // Refactor Snackbar into it's own Component if you have time
  const action = (
    <>
      <Button style={{ color: 'cyan' }} size="small" onClick={handleLike}>
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


  // Refactor Table into it's own component
  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      {!loading && likedData.length === 0 ? 
      <Typography variant="body1" sx={{fontWeight: 'bold', marginTop: 1}}>
        No Liked form submissions (Click on New Submission)
      </Typography> : ""}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
      <Typography variant="body1" color="error">
        Error: {error}
      </Typography>
      ) : (
        <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Fullname
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {likedData.map((value, idx) => (
                <TableRow key={idx}>
                  <TableCell>{`${value.firstName} ${value.lastName}`}</TableCell>
                  <TableCell>{value.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
