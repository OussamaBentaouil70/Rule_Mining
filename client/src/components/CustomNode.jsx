// src/components/CustomNode.jsx
import React from "react";
import { Handle } from "react-flow-renderer";

const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #777",
        borderRadius: 5,
        width: "200px",
      }}
    >
      <strong>{data.label}</strong>
      <p>{data.description}</p>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default CustomNode;
