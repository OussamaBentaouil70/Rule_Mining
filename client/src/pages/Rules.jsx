import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextareaAutosize,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
const NavigationPanel = styled(Box)({
  width: "25%",
  borderRight: "1px solid #ccc",
  padding: "16px",
  boxSizing: "border-box",
});

const EditorPanel = styled(Box)({
  width: "75%",
  padding: "16px",
  boxSizing: "border-box",
});

const RuleEditor = styled(TextareaAutosize)({
  width: "100%",
  height: "calc(100% - 48px)", // Subtract the height of the buttons
  padding: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "monospace",
  boxSizing: "border-box",
  backgroundColor: "white",
  color: "black",
});

export default function Rules() {
  const { user } = useContext(UserContext);
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [open, setOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", description: "" });

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await Axios.get("/api/rules_by_tag/", {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     });
    //     setRules(response.data);
    //   } catch (error) {
    //     console.error("Error fetching data: ", error);
    //   }
    // };
    const fetchData2 = async () => {
      try {
        const response = await Axios.get("/api/get_rules/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRules(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData2();
  }, []);

  const handleSave = async () => {
    if (selectedRule) {
      try {
        await Axios.put(
          `/api/edit_rule/${selectedRule._id}/`,
          { description: editorContent },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setRules((prevRules) =>
          prevRules.map((rule) =>
            rule._id === selectedRule._id
              ? { ...rule, description: editorContent }
              : rule
          )
        );
        setSelectedRule((prevSelectedRule) => ({
          ...prevSelectedRule,
          description: editorContent,
        }));
        toast.success("Rule updated successfully!");
      } catch (error) {
        console.error("Error saving data: ", error);
        toast.error("Error updating rule");
      }
    }
  };

  const handleAdd = async () => {
    const ruleToAdd = {
      ...newRule,
      tag: user.fonction || "defaultTag",
    };
    try {
      const response = await Axios.post("/api/add_rule/", ruleToAdd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      // Assuming response.data contains the newly added rule object
      const addedRule = {
        ...ruleToAdd,
        _id: response.data.rule_id, // assuming the backend returns the new rule's ID
      };
      setRules([...rules, addedRule]);
      toast.success("Rule added successfully!");
      setNewRule({ name: "", description: "" });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding rule: ", error);
      toast.error("Error adding rule");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      if (selectedRule) {
        try {
          await Axios.delete(`/api/delete_rule/${selectedRule._id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setRules(rules.filter((rule) => rule._id !== selectedRule._id));
          setSelectedRule(null);
          setEditorContent("");
          toast.success("Rule deleted successfully!");
        } catch (error) {
          console.error("Error deleting rule: ", error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            toast.error(`Error deleting rule: ${error.response.data.error}`);
          } else {
            toast.error("Error deleting rule");
          }
        }
      }
    }
  };

  const handleRuleSelection = (rule) => {
    setSelectedRule(rule);
    setEditorContent(rule.description);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewRule({ name: "", description: "" });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "rgb(245, 245, 245)" }}>
        <NavigationPanel>
          <Typography variant="h6" gutterBottom>
            Explorer
          </Typography>
          <List>
            <Paper
              sx={{
                bgcolor: "white",
                width: "100%",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              {rules.map((rule) => (
                <ListItem
                  button
                  key={rule._id}
                  onClick={() => handleRuleSelection(rule)}
                >
                  <ListItemText primary={rule.name} />
                </ListItem>
              ))}
            </Paper>
          </List>
          <Divider />
        </NavigationPanel>
        <EditorPanel>
          {selectedRule ? (
            <>
              <Paper
                sx={{
                  bgcolor: "white",
                  width: "fit-content",
                  display: "inline-block",
                  marginBottom: "16px",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {selectedRule.name}
                </Typography>
              </Paper>

              <RuleEditor
                minRows={20}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
              <Box sx={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <Tooltip title="Add Rule">
                  <IconButton color="primary" onClick={handleClickOpen}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Update Rule">
                  <IconButton color="primary" onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Rule">
                  <IconButton color="primary" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Typography variant="h6" gutterBottom>
              Select a rule to view its details
            </Typography>
          )}
        </EditorPanel>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Rule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rule Name"
            type="text"
            fullWidth
            variant="standard"
            value={newRule.name}
            onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={newRule.description}
            onChange={(e) =>
              setNewRule({ ...newRule, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Tag"
            type="text"
            fullWidth
            variant="standard"
            value={user.fonction || "defaultTag"}
            disabled
            onChange={(e) => setNewRule({ ...newRule, tag: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
