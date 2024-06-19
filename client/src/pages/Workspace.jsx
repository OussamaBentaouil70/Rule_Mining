import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Grid,
  Input,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const Workspace = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(
    JSON.parse(localStorage.getItem("uploadedFiles")) || []
  );

  useEffect(() => {
    localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      await Axios.post("/rules/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          bgcolor: "rgb(245, 245, 245)",
          p: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h5" gutterBottom>
            Workspaces
          </Typography>
          <Grid container spacing={3}>
            {uploadedFiles.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 200,
                    textAlign: "center",
                    p: 2,
                    borderStyle: "dashed",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {file}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/rules`}
                  >
                    Open
                  </Button>
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  textAlign: "center",
                  p: 2,
                  borderStyle: "dashed",
                }}
              >
                <UploadFileIcon sx={{ fontSize: 40 }} />
                <Typography variant="h6" gutterBottom>
                  Add Workspace
                </Typography>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ accept: ".csv,.txt,.zip" }}
                  sx={{ display: "none" }}
                  id="upload-button"
                />
                <label htmlFor="upload-button">
                  <Button variant="outlined" component="span">
                    Choose File
                  </Button>
                </label>
                {uploading && <CircularProgress sx={{ mt: 2 }} />}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Workspace;
