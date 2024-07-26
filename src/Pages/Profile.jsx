import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  Stack,
  Grid
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import '../styles/Profile.css';
import Loading from "../components/loader";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import Notification from '../components/notification/notification.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const [user, setUser] = useState({
    name: 'Izere H.',
    joinDate: 'May 2024',
    approved: true,
    emailVerified: true,
    phoneVerified: false,
    facebookConnected: false,
  });

  const reviews = [
    {
      text: "It was a great experience renting a bike from Izere. The bike was in excellent condition and made my trip so much more enjoyable!",
      reviewerImage: "https://izygear.s3.us-east-2.amazonaws.com/profile-images/11a61394-331a-4994-a997-5133d3596976.jpeg",
      reviewerName: "John D.",
      timeAgo: "3 months ago"
    },
    {
      text: "I rented a snowboard from Izere and it was perfect for my skill level. The equipment was well-maintained and Izere was very helpful.",
      reviewerImage: "https://izygear.s3.us-east-2.amazonaws.com/profile-images/11a61394-331a-4994-a997-5133d3596976.jpeg",
      reviewerName: "Sarah M.",
      timeAgo: "2 months ago"
    },
    {
      text: "The ski equipment I rented from Izere was top-notch. It made my skiing experience so much better. Highly recommend!",
      reviewerImage: "https://izygear.s3.us-east-2.amazonaws.com/profile-images/11a61394-331a-4994-a997-5133d3596976.jpeg",
      reviewerName: "Alex K.",
      timeAgo: "20 days ago"
    }
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [ownerGearList, setOwnerGearList] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  

  const getOwnerGearList = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://192.168.1.66:3001/users/${userId}/ownerGear/profile`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Owner Gear list:", data);
        setOwnerGearList(data);
        setIsLoading(false)
      } else if (response.status === 404) {
        console.warn("No listed gears found at this time");
        setIsLoading(false)
      } else {
        setIsLoading(false)
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setIsLoading(false)
      console.log("Fetch Owner Gear List failed!", err.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOwnerGearList();
  }, [userId]);

  useEffect(() => {
    const listingUpdated = localStorage.getItem("listingUpdated");
    if (listingUpdated === "true") {
      toast.success("Listing updated successfully!");
      localStorage.removeItem("listingUpdated");  // Clean up after showing the toast
    }
  }, []);

  const changeStatus = async (category, listingId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://192.168.1.66:3001/users/${userId}/${category}/${listingId}/status`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        const data = await response.json();
        toast.success("Changes applied successfully");
        // Update the local state to reflect the change
        setOwnerGearList(prevList => 
          prevList.map(item => 
            item._id === listingId 
              ? {...item, status: data.newStatus} 
              : item
          )
        );
      } else {
        throw new Error('Failed to change status');
      }
    } catch (err) {
      toast.error("Oops. Something went wrong. Try again later!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <Loading />;
  return (
    <>
      <Navbar />
      <Notification/>
      <Container maxWidth="md" className="profile">
        <Stack spacing={2}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <UserInfo user={user} />
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <VerifiedInfo user={user} />
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Reviews reviews={reviews} />
          </Paper>
        </Stack>
      </Container>
      <OwnerGearList ownerGearList={ownerGearList} changeStatus={changeStatus} />
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
        text="Approved to rent" 
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

const Reviews = ({ reviews }) => {
  return (
    <Box className="reviews">
      <Typography variant="h6" gutterBottom>Reviews from renters</Typography>
      {reviews.length === 0 ? (
        <>
          <Typography variant="body1">No reviews yet</Typography>
          <Typography variant="body2" color="text.secondary">
            Izere hasn't received a review on IzyGear yet.
          </Typography>
        </>
      ) : (
        <>
          <Box className="reviews-container">
            {reviews.map((review, index) => (
              <Box key={index} className="review-card">
                <Typography variant="body1" className="review-text">"{review.text}"</Typography>
                <Box className="reviewer-info">
                  <Avatar src={review.reviewerImage} alt="Reviewer" className="reviewer-avatar" />
                  <Box className="reviewer-details">
                    <Typography variant="subtitle2" className="reviewer-name">{review.reviewerName}</Typography>
                    <Typography variant="body2" color="text.secondary">{review.timeAgo}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Typography variant="body2" className="review-count" color="text.secondary">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </Typography>
        </>
      )}
    </Box>
  );
};

const OwnerGearList = ({ ownerGearList, changeStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="listContainer_r9s0t">
      <h1 className="titleList_u1v2w">Listed Gears</h1>
      {ownerGearList.length === 0 ? (
        <p className="reservationMessage_x3y4z">No listed gears found at this time</p>
      ) : (
        <div className="reservationGrid_a5b6c">
          <div className="reservationScroll_x1y2z">
            {ownerGearList.map((gear) => (
              <div className="reservationItem_d7e8f" key={gear._id}>
                <ListingCard 
                  style={{ width: '100%' }}
                  listingId={gear._id}
                  creator={gear.creator._id}
                  listingPhotoPaths={gear.listingPhotoPaths}
                  address={gear.address}
                  condition={gear.condition}
                  category={gear.category}
                  title={gear.title}
                  type={gear.type}
                  price={gear.price}
                  booking={false}
                />
                <div className="actionButtons_g9h0i">
                  <button 
                    className="editButton_j1k2l"
                    onClick={() => navigate(`/editListing`, { state: { currentListing: gear } })}
                  >
                    <EditIcon /> Edit
                  </button>
                  <button 
                    className={gear.status === 'active' ? "deleteButton_m3n4o" : "undoButton_m3n4o"}
                    onClick={() => changeStatus(gear.category, gear._id)}
                  >
                    {gear.status === 'active' ? (
                      <><DeleteIcon /> Delete</>
                    ) : (
                      <><UndoIcon /> Undo Delete</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Typography variant="body2" className="gear-count" color="text.secondary">
        {ownerGearList.length} {ownerGearList.length === 1 ? 'gear' : 'gears'} listed
      </Typography>
    </div>
  );
};
export default Profile;