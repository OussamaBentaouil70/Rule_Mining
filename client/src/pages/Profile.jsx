import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Grid, Typography, Avatar, Paper } from "@mui/material";
import Axios from "axios";
import { Image } from 'cloudinary-react'; // Import Cloudinary components
import Sidebar from "../components/Sidebar";

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState('');

  const [userInfo, setUserInfo] = useState({
    username: '',
    full_name: '',
    role: '',
    email: '',
    phone_number: '',
    address: '',
    bio: ''
  });

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await Axios.get("/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(response.data);
      } else {
        console.error("Token not found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "avatar") {
      const file = event.target.files[0];
      
      // Display image preview
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload image to Cloudinary and get the URL
        // Update 'cloud_name' with your Cloudinary cloud name
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'your_upload_preset');
        
        fetch('https://api.cloudinary.com/v1_1/cloud_name/image/upload', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          setImageURL(data.secure_url);
        })
        .catch(error => console.error('Error uploading image to Cloudinary:', error));
      }
    } else {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      
      // Send image URL instead of the actual file data
      const jsonData = {
        ...userInfo,
        avatar: imageURL,
      };

      await Axios.put("/api/update_profile/", jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const getRandomColor = () => {
    const colors = ["#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#FF5722"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Update your photo & personal details here...
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {/* Your form fields */}
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    Profile Picture
                  </Typography>
                  {/* Avatar display and file input */}
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
