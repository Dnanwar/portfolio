import React, { useEffect, useRef, useState } from "react";
import paper from "../../assets/images/paper.png"; // Adjust path as needed

const Achievements = ({ scrollContainer }) => {
  const pathRef = useRef(null);
  const planeRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Define the path points
  const pathPoints = [
    { x: 100, y: 150 },
    { x: 300, y: 100 },
    { x: 500, y: 200 },
    { x: 750, y: 50 },
    { x: 350, y: 250 },
    { x: 600, y: 300 },
    { x: 800, y: 100 },
    { x: 1000, y: 200 },
  ];

  // Calculate the position on the path based on scroll progress
  const getPointOnPath = (progress) => {
    if (pathPoints.length < 2) return { x: 0, y: 0 };

    const totalSegments = pathPoints.length - 1;
    const segmentIndex = Math.min(
      Math.floor(progress * totalSegments),
      totalSegments - 1
    );

    const segmentProgress = progress * totalSegments - segmentIndex;

    const start = pathPoints[segmentIndex];
    const end = pathPoints[segmentIndex + 1];

    // Simple linear interpolation between points
    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress,
      // Calculate rotation based on the angle between points
      angle: Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI),
    };
  };

  useEffect(() => {
    if (!scrollContainer || !sectionRef.current) return;

    const handleScroll = () => {
      // Calculate how far we've scrolled within the achievements section
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start animation when the section is in view
      if (rect.top <= viewportHeight && rect.bottom >= 0) {
        // Calculate a progress value between 0 and 1
        // 0 = section just entered view from bottom
        // 1 = section completely scrolled out of view at top
        let progress;

        if (rect.top >= 0) {
          // Section is partially or fully visible, entering from bottom
          progress = 1 - rect.top / viewportHeight;
        } else {
          // Section is partially visible, exiting at top
          progress = 1 + Math.abs(rect.top) / rect.height;
        }

        // Normalize to 0-1 range
        progress = Math.max(0, Math.min(1, progress));
        setScrollProgress(progress);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainer]);

  // Position the plane based on the calculated scroll progress
  useEffect(() => {
    if (!planeRef.current) return;

    const { x, y, angle } = getPointOnPath(scrollProgress);

    planeRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    planeRef.current.style.opacity = Math.min(1, Math.max(0.2, scrollProgress));
  }, [scrollProgress]);

  // Draw the path for debugging (you can remove this in production)
  useEffect(() => {
    if (!pathRef.current) return;

    const ctx = pathRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, pathRef.current.width, pathRef.current.height);

    // Draw the path
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);

    for (let i = 1; i < pathPoints.length; i++) {
      ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          color: "#111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 100, marginBottom: "20px" }}>
          Achievements
        </h1>
        <ul
          style={{ fontSize: "1rem", lineHeight: "1.8", paddingLeft: "20px" }}
        >
          <li>
            🏆 Winner of Tredence HackFest 2024 (1st place among 40 global
            teams)
          </li>
          <li>⚙️ 4★ Coder on CodeChef with peak rating of 1820</li>
          <li>🌍 Global Rank 53 in CodeChef Starters 112</li>
          <li>🧠 LeetCode Top 5% with 3★ and rating of 1838</li>
          <li>☁️ Google Cloud Certified Professional Data Engineer</li>
          <li>🔧 Microsoft Certified Azure Data Engineer Associate</li>
          <li>🩺 A-grade ML Medical Assistance Project (Thapar University)</li>
        </ul>
      </div>
      <div
        style={{
          flex: 3,
          backgroundColor: "black",
          position: "relative",
        }}
      >
        {/* Path visualization (can be removed in production) */}
        <canvas
          ref={pathRef}
          width={1200}
          height={800}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        {/* Paper plane */}
        <img
          ref={planeRef}
          src={paper}
          alt="Flying paper"
          style={{
            position: "absolute",
            width: "60px",
            zIndex: 10,
            transition: "transform 0.1s ease-out",
            transformOrigin: "center center",
          }}
        />
      </div>
    </div>
  );
};

export default Achievements;
