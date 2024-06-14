import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextareaAutosize,
  Typography,
  Button,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { styled } from "@mui/system";
import Paper from "@mui/material/Paper";
import toast from "react-hot-toast";
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
  height: "calc(100% - 48px)", // Subtract the height of the button
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
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/api/rules_by_tag/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRules(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
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

    // fetchData();
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
        // Update the rules list with the new description
        setRules((prevRules) =>
          prevRules.map((rule) =>
            rule._id === selectedRule._id
              ? { ...rule, description: editorContent }
              : rule
          )
        );
        // Reset the selected rule with the updated description
        setSelectedRule((prevSelectedRule) => ({
          ...prevSelectedRule,
          description: editorContent,
        }));
        toast.success("Rule updated successfully!");
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
  };

  const handleRuleSelection = (rule) => {
    setSelectedRule(rule);
    setEditorContent(rule.description);
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
                width: "100%  ",
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
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: "16px" }}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          ) : (
            <Typography variant="h6" gutterBottom>
              Select a rule to view its details
            </Typography>
          )}
        </EditorPanel>
      </Box>
    </Box>
  );
}
