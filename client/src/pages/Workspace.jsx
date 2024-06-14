import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Input,
  CircularProgress,
} from "@mui/material";
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
      <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "rgb(245, 245, 245)" }}>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Upload Your Files
            </Typography>
            <Input
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: ".csv,.txt,.zip" }}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
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
        </Container>
      </Box>
    </Box>
  );
};

export default Workspace;
