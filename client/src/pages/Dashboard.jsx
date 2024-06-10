import React from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Button, Box, IconButton, Avatar } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateMemberModal from "../components/CreateMemberModal";
import EditMemberModal from "../components/EditMemberModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleEdit = (member) => {
    setSelectedMember(member);
    setOpenEditModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await Axios.get("/api/get_members/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
        },
      });

      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      // Handle errors here, e.g. by showing an error message
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (member) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      const token = localStorage.getItem("token");
      // Call the delete API endpoint
      Axios.delete(`/api/delete_member/${member.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success("Member deleted successfully!");
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Error deleting member:", error);
        });
    }
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <Box>
      <Sidebar />
      <Box sx={{ bgcolor: "rgb(245, 245, 245)", p: 3, minHeight: "100vh" }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
          >
            Create New Member
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 1200, margin: "auto" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Function</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: getRandomColor(), mr: 2 }}>
                        {member.username.charAt(0).toUpperCase()}
                      </Avatar>
                      {member.username}
                    </Box>
                  </TableCell>
                  <TableCell align="left">{member.email}</TableCell>
                  <TableCell align="left">{member.role}</TableCell>
                  <TableCell align="left">{member.fonction}</TableCell>
                  <TableCell align="left">
                    <IconButton onClick={() => handleEdit(member)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(member)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CreateMemberModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
        />
        {/* Edit Member Modal */}
        <EditMemberModal
          open={openEditModal}
          handleClose={() => setOpenEditModal(false)}
          member={selectedMember}
        />
      </Box>
    </Box>
  );
}
