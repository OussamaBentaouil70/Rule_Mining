import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import Axios from "axios";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const [userInfo, setUserInfo] = useState({
    username: "",
    full_name: "",
    role: "",
    email: "",
    phone_number: "",
    address: "",
    fonction: "",
    bio: "",
    avatar: "",
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
        setImageURL(response.data.avatar); // Set initial avatar URL
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

  const handleChange = async (event) => {
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
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "zjpblyid");

        try {
          const response = await Axios.post(
            "https://api.cloudinary.com/v1_1/dkez34lgd/image/upload",
            formData,
            {
              headers: { "X-Requested-With": "XMLHttpRequest" },
              withCredentials: false,
            }
          );
          setImageURL(response.data.secure_url);
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            avatar: response.data.secure_url,
          }));
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
        }
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

      const jsonData = {
        ...userInfo,
        avatar: imageURL, // Attach the uploaded image URL to the avatar field
      };
      console.log(jsonData);
      await Axios.put("/api/update_profile/", jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("The profile is updated successfully!");
      fetchUserInfo();
      window.location.href = "/profile";
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="username"
                      label="Username"
                      value={userInfo.username}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="full_name"
                      label="Full Name"
                      value={userInfo.full_name}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="email"
                      label="Email"
                      value={userInfo.email}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="phone_number"
                      label="Phone Number"
                      value={userInfo.phone_number}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="address"
                      label="Address"
                      value={userInfo.address}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="fonction"
                      label="Fonction"
                      value={userInfo.fonction}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="bio"
                      label="Bio"
                      value={userInfo.bio}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Profile Picture
                  </Typography>
                  <Avatar
                    src={imagePreview || userInfo.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: getRandomColor(),
                      fontSize: 50,
                    }}
                  >
                    {!imagePreview &&
                      !userInfo.avatar &&
                      userInfo.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Upload
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      hidden
                      onChange={handleChange}
                    />
                  </Button>
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
