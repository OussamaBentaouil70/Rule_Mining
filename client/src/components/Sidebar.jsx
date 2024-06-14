import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import GavelIcon from "@mui/icons-material/Gavel";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../assets/logo2.png";
import { UserContext } from "../../context/userContext";
import HomeIcon from "@mui/icons-material/Home";
const Sidebar = () => {
  const { logout } = useContext(UserContext);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "50%", height: "auto" }}
          href="/"
        />
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/workspaces">
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Workspaces" />
          </ListItem>
          <ListItem button component={Link} to="/rules">
            <ListItemIcon>
              <GavelIcon />
            </ListItemIcon>
            <ListItemText primary="Rules" />
          </ListItem>
          <ListItem button component={Link} to="/chat">
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="ChatBot" />
          </ListItem>
          <ListItem button component={Link} to="/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
