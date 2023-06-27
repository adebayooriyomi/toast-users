import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { fetchLikedFormSubmissions } from './service/mockServer';

export default function Content() {
  const [likedData, setLikedData] = useState([])

  const getLikedData = async () => {
    const data = await fetchLikedFormSubmissions()
    setLikedData(data.formSubmissions)
    console.log(data.formSubmissions)
  }

  useEffect(() => {
    getLikedData()
  },[])

  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      <Typography variant="body1" sx={{fontStyle: 'italic', marginTop: 1}}>
        TODO: List of liked submissions here (delete this line)
      </Typography>
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
    </Box>
  );
}
