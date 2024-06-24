import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactFlow, { Controls, Background, MiniMap } from "react-flow-renderer";
import CustomNode from "../components/CustomNode";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
const nodeTypes = {
  customNode: CustomNode,
};

const RuleFlow = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/get_rules/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const rules = response.data;

        // Adjust spacing between nodes
        const nodes = rules.map((rule, index) => ({
          id: rule._id.toString(),
          type: "customNode",
          data: { label: rule.name, description: rule.description },
          position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 300 },
        }));

        setNodes(nodes);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          bgcolor: "rgb(245, 245, 245)",
        }}
      >
        <div style={{ height: "100vh", width: "100%" }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes}>
            <Controls />
            <Background color="#f0f0f0" gap={16} />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === "customNode") return "blue";
                return "#FFCC00";
              }}
            />
          </ReactFlow>
        </div>
      </Box>
    </Box>
  );
};

export default RuleFlow;
