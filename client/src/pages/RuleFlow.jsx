import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";
import CustomNode from "../components/CustomNode";
import { Box, Button } from "@mui/material";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const nodeTypes = {
  customNode: CustomNode,
};

const RuleFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch saved flow data
        const response = await axios.get("/rules/get_flow/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.nodes && response.data.nodes.length > 0) {
          setNodes(response.data.nodes);
          setEdges(response.data.edges || []);
        } else {
          // If no saved flow, fetch rules
          const rulesResponse = await axios.get("/api/get_rules/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const rules = rulesResponse.data;
          console.log("Rules: ", rules);
          const nodes = rules.map((rule, index) => ({
            id: rule._id.toString(),
            type: "customNode",
            data: { label: rule.name, description: rule.description },
            position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 300 },
          }));

          setNodes(nodes);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const saveFlow = async () => {
    try {
      const response = await axios.post(
        "/rules/save_flow/",
        { nodes, edges },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Flow saved successfully!");
        toast.success("Flow saved successfully!");
      }
    } catch (error) {
      console.error("Error saving flow: ", error);
      toast.error("Error saving flow ");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          bgcolor: "rgb(245, 245, 245)",
          position: "relative",
        }}
      >
        <div style={{ height: "100vh", width: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            <Controls />
            <Background color="#f0f0f0" gap={16} />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === "customNode") return "blue";
                return "#FFCC00";
              }}
            />
          </ReactFlow>
          <Button
            onClick={saveFlow}
            variant="contained"
            color="primary"
            sx={{ position: "fixed", top: 16, right: 16 }}
          >
            Save Flow
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default RuleFlow;
