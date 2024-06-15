import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Input,
  CircularProgress,
  Grid,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Axios from "axios";
import Sidebar from "../components/Sidebar";

const Workspace = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setUploadSuccess(false);

    try {
      await Axios.post("/rules/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading file:", error);
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
              </Paper>
            </Grid>
            {selectedFile && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="body1">{selectedFile.name}</Typography>
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? <CircularProgress size={24} /> : "Upload"}
                    </Button>
                  </Box>
                  {uploadSuccess && (
                    <Typography variant="body1" color="success" sx={{ mt: 2 }}>
                      File uploaded successfully!
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Workspace;
