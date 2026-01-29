import React, { useState } from "react";
import "./filterSelection.css";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function FilterSection({
  title,
  children,
  defaultOpen = true,
  showDivider = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      {/* HEADER */}
      <Box
        onClick={() => {
          console.log("toggle", !open); // 🔍 debug proof
          setOpen(!open);
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#1f1f1f",
          }}
        >
          {title}
        </Typography>

        <ExpandMoreIcon
          style={{
            fontSize: 18,
            color: "#757575",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        />
      </Box>

      {/* CONTENT */}
      <Collapse in={open} timeout="auto">
        {/* 🔴 THIS WRAPPER IS CRITICAL */}
        <div style={{ overflow: "visible" }}>
          <Box
            style={{
              paddingLeft: 4,
              paddingBottom: 8,
            }}
          >
            {children}
          </Box>
        </div>
      </Collapse>

      {/* DIVIDER */}
      {showDivider && (
        <Divider
          style={{
            borderColor: "#eaeaea",
            marginTop: 4,
          }}
        />
      )}
    </div>
  );
}

export default FilterSection;
