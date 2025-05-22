import React, { useState } from "react";
import "./index.css";
import gitHub from "../../assets/images/gitHub.png";

const MAX_CHAR = 180;

const ProjectCard = ({ name, description, githubUrl, liveUrl }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > MAX_CHAR;
  const displayedText = expanded
    ? description
    : description.slice(0, MAX_CHAR) + (isLong ? "..." : "");

  return (
    <div
      className={`glass-card ${expanded ? "expanded-card" : ""}`}
      style={{
        position: "relative",
        width: "clamp(280px, 28vw, 400px)",
        aspectRatio: "4 / 3",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: "260px",
      }}
    >
      {/* Project Name and GitHub */}
      <div
        style={{
          width: "100%",
          marginBottom: "12px",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          className="section-title"
          style={{
            margin: 0,
            color: "white",
            fontWeight: 400,
            fontSize: "1rem",
          }}
        >
          {name}
        </h2>

        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={gitHub}
              alt="GitHub"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </a>
        )}
      </div>

      {/* Description */}
      <div style={{ flexGrow: 1 }}>
        <p
          style={{
            color: "white",
            opacity: 0.85,
            lineHeight: "1.6",
            fontSize: "0.95rem",
            wordBreak: "break-word",
            fontFamily: "system-ui, sans-serif",
            overflow: "hidden",
          }}
        >
          {displayedText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              color: "#aad8ff",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.9rem",
              fontFamily: "inherit",
              marginTop: "4px",
            }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
