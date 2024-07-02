import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import Navbar from "../components/Navbar";
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Izere H.',
    joinDate: 'May 2024',
    approved: true,
    emailVerified: true,
    phoneVerified: false,
    facebookConnected: false,
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="md" className="profile">
        <Stack spacing={2}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <UserInfo user={user} />
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <VerifiedInfo user={user} />
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Reviews />
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

const UserInfo = ({ user }) => (
  <Box className="user-info">
    <Box className="user-avatar-name">
      <Avatar className="user-avatar">{user.name[0]}</Avatar>
      <Box className="user-details">
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Joined {user.joinDate}
        </Typography>
      </Box>
    </Box>
    <Button variant="contained" className="edit-profile-button">Edit profile</Button>
  </Box>
);

const VerifiedInfo = ({ user }) => (
  <Box className="verified-info">
    <Typography variant="h6" gutterBottom>Verified Info</Typography>
    <List>
      <VerifiedItem 
        text="Approved to drive" 
        verified={user.approved} 
      />
      <VerifiedItem 
        text="Email address" 
        verified={user.emailVerified} 
        actionText="Verify email"
      />
      <VerifiedItem 
        text="Phone number" 
        verified={user.phoneVerified} 
        actionText="Verify phone number"
      />
      <VerifiedItem 
        text="Facebook" 
        verified={user.facebookConnected} 
        actionText="Connect account"
      />
    </List>
  </Box>
);

const VerifiedItem = ({ text, verified, actionText }) => (
  <ListItem>
    <ListItemIcon>
      {verified ? <Check color="success" /> : <Close color="error" />}
    </ListItemIcon>
    <ListItemText primary={text} />
    {!verified && actionText && (
      <Button variant="outlined" size="small">{actionText}</Button>
    )}
  </ListItem>
);

const Reviews = () => (
  <Box className="reviews">
    <Typography variant="h6" gutterBottom>Reviews from hosts</Typography>
    <Typography variant="body1">No reviews yet</Typography>
    <Typography variant="body2" color="text.secondary">
      Izere hasn't received a review on Turo yet.
    </Typography>
  </Box>
);

export default Profile;