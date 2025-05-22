import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import laptop from "./assets/images/laptop.png";
import paper from "./assets/images/paper.png";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import ProjectCard from "./components/ProjectCard";
import { useSpring, animated } from "@react-spring/web";
import Experiences from "./components/Experiences";
import clouds from "./assets/images/clouds.png";
import city from "./assets/images/city.png";
import TypingText from "./components/TypingText";
import Contacts from "./components/Contacts";
function App() {
  const parallaxRef = useRef(null);
  const planeRef = useRef(null);
  const achievementsSectionRef = useRef(null);
  const experiencesSectionRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [planeScale, setPlaneScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollProgressAchievements, setScrollProgressAchievements] =
    useState(0);
  const [scrollProgressExperience, setScrollProgressExperience] = useState(0);

  const totalPages = 6;
  // Define the path points for the paper plane

  const [containerWidth, setContainerWidth] = useState(2000);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleResize() {
      setContainerWidth(window.innerWidth || 2000);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const leftEdge = 0;
  const rightEdge = containerWidth;
  const pathPoints = [
    // Right to left, descending
    { x: rightEdge, y: 120 },
    { x: rightEdge * 0.875, y: 180 },
    { x: rightEdge * 0.75, y: 340 },
    { x: rightEdge * 0.625, y: 500 },
    { x: rightEdge * 0.5, y: 620 },
    { x: rightEdge * 0.375, y: 500 },
    { x: rightEdge * 0.3125, y: 340 }, // 31.25% for some curve before min edge
    { x: leftEdge, y: 180 }, // Now starts from leftEdge, not 0
    // Left to right, ascending
    { x: rightEdge * 0.3125, y: 340 },
    { x: rightEdge * 0.375, y: 500 },
    { x: rightEdge * 0.5, y: 620 },
    { x: rightEdge * 0.625, y: 500 },
    { x: rightEdge * 0.75, y: 340 },
    { x: rightEdge * 0.875, y: 180 },
    { x: rightEdge, y: 120 },
  ];

  // Calculate the position on the path based on scroll progress

  // Replace the getPointOnPath function with this updated version
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

    // Detect direction: flying left to right or right to left
    const isGoingLeft = end.x < start.x;

    // Simple linear interpolation between points
    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress,
      // Instead of rotation angle, just provide direction flag
      isGoingLeft: isGoingLeft,
    };
  };
  const projectData = [
    {
      name: "Book Recommender",
      description:
        "Collaborative Recommender with an intuitive React frontend and a Flask backend, deployed on Heroku. Utilizes user interaction data to compute pairwise cosine similarity, powering personalized recommendations through a lightweight and efficient algorithm.",
      githubUrl:
        "https://github.com/Dnanwar/Collaborative-Recommendation-Book-Recommender-FLASK",
      liveUrl: "",
    },
    {
      name: "Youtube Shorts Creator",
      description:
        "A smart tool designed to create and preview 30-second short-format videos. It leverages viewer heatmaps from popular YouTube videos to identify the most engaging moments, then processes these highlights to suggest optimized short-form content. The tool also includes a mobile preview mode to simulate how the Shorts will appear on a phone, ensuring a seamless viewer experience across platforms.",
      githubUrl: "https://github.com/stars/Dnanwar/lists/shorts-creator",
      liveUrl: "https://shorts-creator-fe-796467600518.asia-south1.run.app/",
    },
    {
      name: "Neural Network (No Libraries)",
      description:
        "Built a Neural Network from scratch without using any ML libraries. Implemented forward and backward propagation, weight updates, biases, ReLU, and SoftMax activation functions to train and evaluate the model.",
      githubUrl:
        "https://github.com/Dnanwar/Building-Neural-Network-Model-Without-Libraries",
      liveUrl: "",
    },
  ];
  // On initial load — stabilize stickies
  useEffect(() => {
    const timeout1 = setTimeout(() => {
      parallaxRef.current?.scrollTo(0.01);
    }, 100);
    const timeout2 = setTimeout(() => {
      setInitialized(true);
    }, 500); // Increased timeout to ensure container is fully ready
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);
  useEffect(() => {
    if (!planeRef.current) return;
    const { x, y, isGoingLeft } = getPointOnPath(scrollProgress);

    // Apply appropriate transform - flip horizontally when going left
    const dynamicScale = 0.4 + scrollProgress * 1;
    planeRef.current.style.transform = `translate(${x}px, ${y}px) scale(${
      isGoingLeft ? -dynamicScale : dynamicScale
    }, ${dynamicScale})`;
  }, [scrollProgress, planeScale]);
  useEffect(() => {
    const handleScroll = () => {
      const container = parallaxRef.current?.container?.current;
      if (!container) return;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollFraction = scrollTop / maxScroll;
      setScale(1 - Math.min(scrollFraction * 0.5, 0.75));
      const page = Math.round(scrollFraction * (totalPages - 1));
      setCurrentPage(page);
      // Calculate paper plane scale based on current position
      // Scale it down slightly in lower pages (Achievements) and up in higher pages (Experience)
      let newPlaneScale = 1;
      if (page >= 4 && page <= 5) {
        // Scale up to 1.2 for the Experience section
        newPlaneScale = 1.2;
      } else if (page >= 5) {
        // Scale back down to 1 after the Experience section
        newPlaneScale = 1;
      }
      setPlaneScale(newPlaneScale);
      const start = 1 / totalPages;
      const end = 3 / totalPages;
      if (scrollFraction >= start && scrollFraction <= end) {
        const localFraction = (scrollFraction - start) / (end - start);
        const newIndex = Math.min(
          projectData.length - 1,
          Math.round(localFraction * (projectData.length - 1))
        );
        setActiveIndex(newIndex);
      }
      // Calculate scroll progress for the flying paper plane
      // We want it to cover both the Achievements and Experience sections
      if (page >= 4) {
        // We're in the sections with the plane
        // Calculate localized progress for these sections
        const sectionStart = 4 / totalPages;
        const sectionEnd = 6 / totalPages;
        const localProgress =
          (scrollFraction - sectionStart) / (sectionEnd - sectionStart);
        setScrollProgress(Math.max(0, Math.min(1, localProgress)));
      }
      if (page >= 3 && page <= 5) {
        const achievementsStart = 3 / totalPages;
        const achievementsEnd = 5 / totalPages;
        const localAchievementProgress =
          (scrollFraction - achievementsStart) /
          (achievementsEnd - achievementsStart);
        setScrollProgressAchievements(
          Math.max(0, Math.min(1, localAchievementProgress))
        );
      } else {
        setScrollProgressAchievements(0); // reset when outside section
      }
      if (page >= 4 && page < 5) {
        const experienceStart = 4 / totalPages;
        const experienceEnd = 6 / totalPages;
        const localExperienceProgress =
          (scrollFraction - experienceStart) /
          (experienceEnd - experienceStart);
        setScrollProgressExperience(
          Math.max(0, Math.min(1, localExperienceProgress))
        );
      } else {
        setScrollProgressExperience(0); // Reset when outside section
      }
    };
    const container = parallaxRef.current?.container?.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [projectData.length, totalPages]);
  const profileStyles = useSpring({
    scale: currentPage >= 0 && currentPage <= 3 ? 1 : 0,
    opacity: currentPage > 0 && currentPage < 3 ? 1 : 0,
    config: { tension: 250, friction: 20 },
  });
  const panelStyle = (index) => {
    if (isMobile) {
      // Mobile: center the active card and hide others
      const isActive = index === activeIndex;
      return {
        display: "inline-block",
        transition: "transform 0.5s ease, opacity 0.3s ease",
        transform: isActive
          ? "translateX(0%) scale(1.1)"
          : index < activeIndex
          ? "translateX(-100%) scale(0.8)"
          : "translateX(100%) scale(0.8)",
        opacity: isActive ? 1 : 0.3,
        position: "absolute",
        left: "50%",
        marginLeft: "-150px", // Adjust based on your card width
      };
    } else {
      // Desktop: original behavior
      return {
        display: "inline-block",
        transition: "transform 0.3s ease",
        transform: `scale(${index === activeIndex ? 1.25 : 0.75})`,
        opacity: 1,
      };
    }
  };

  // Calculate local progress for the Achievements section
  const achievementCardSpring = useSpring({
    width:
      scrollProgressAchievements < 0.2
        ? `${Math.max(scrollProgressAchievements * 100, 0)}%`
        : scrollProgressAchievements > 0.6
        ? `${Math.min((1 - scrollProgressAchievements) * 100, 0)}%`
        : "100%",
    transform:
      scrollProgressAchievements < 0.2
        ? `translateX(${-(1 - scrollProgressAchievements * 2) * 150}%)`
        : scrollProgressAchievements > 0.6
        ? `translateX(-150%)`
        : `translateX(0%)`,
    opacity:
      scrollProgressAchievements < 0.9
        ? 1
        : 1 - (scrollProgressAchievements - 0.9) * 10,
    config: { tension: 220, friction: 30 },
  });

  const experienceCardSpring = useSpring({
    width:
      scrollProgressExperience < 0.1
        ? `${Math.max(scrollProgressExperience * 100, 0)}%`
        : scrollProgressExperience > 1.5
        ? `${Math.min((1 - scrollProgressExperience) * 100, 0)}%`
        : "100%",
    transform:
      scrollProgressExperience < 0.1
        ? `translateX(${(1 - scrollProgressExperience * 2) * 150}%)`
        : scrollProgressExperience > 1.5
        ? `translateX(150%)`
        : `translateX(0%)`,
    opacity:
      scrollProgressExperience < 0.9
        ? 1
        : Math.max(0, 1 - (scrollProgressExperience - 0.9) * 10),
    config: { tension: 220, friction: 30 },
  });

  return (
    <div>
      <Parallax
        pages={7}
        ref={parallaxRef}
        style={{
          background:
            currentPage < 1
              ? "white"
              : "linear-gradient(135deg, #4c83ff, #2afadf)",
        }}
      >
        {/* Page 0 */}
        <ParallaxLayer
          offset={0}
          style={{
            // background: "linear-gradient(135deg, #4c83ff, #2afadf)",
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          <TypingText
            message="Hey, I'm Daniyal Anwar"
            start={currentPage == 0}
          />
        </ParallaxLayer>
        {/* Sticky Laptop Image */}
        <ParallaxLayer
          sticky={{ start: 0, end: 3 }}
          offset={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              backgroundImage: `url(${laptop})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: isMobile ? "90%" : "45%",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
              transform: `scale(${scale})`,
              transition: "transform 0.1s ease-out",
            }}
          />
        </ParallaxLayer>
        {/* Sticky Paper Plane */}
        <ParallaxLayer
          sticky={{ start: 4, end: 5 }}
          offset={0}
          style={{
            position: "relative",
            zIndex: 5,
          }}
        >
          <img
            ref={planeRef}
            src={paper}
            alt="Flying paper"
            style={{
              position: "absolute",
              width: "200px",
              zIndex: 10,
              transition: "transform 0.1s ease-out",
              transformOrigin: "center center",
            }}
          />
        </ParallaxLayer>
        {/* Top Projects */}
        <ParallaxLayer
          offset={1}
          sticky={{ start: 1, end: 3 }}
          style={{
            zIndex: 10,
          }}
        >
          <animated.div
            style={{
              ...profileStyles,
              height: "100%",
              width: "100%",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top 15% - Header */}
            <div
              style={{
                flex: 15,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "20px",
                width: "100%",
              }}
            >
              <h1
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: 100,
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                Top Projects
              </h1>
            </div>
            {/* Middle 70% - Cards */}
            <div
              style={{
                flex: 70,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "no-wrap",
                gap: isMobile ? "0px" : "40px", // No gap on mobile since cards are positioned absolutely
                width: "100%",
                position: "relative", // Add relative positioning for mobile absolute positioning
              }}
            >
              {projectData.map((project, idx) => (
                <div key={idx} style={panelStyle(idx)}>
                  <ProjectCard
                    name={project.name}
                    description={project.description}
                    githubUrl={project.githubUrl}
                    liveUrl={project.liveUrl}
                  />
                </div>
              ))}
            </div>
            {/* Bottom 15% - Progress Bar */}
            <div
              style={{
                flex: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <animated.div
                style={{
                  opacity: profileStyles.opacity,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {projectData.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "50px",
                      height: "6px",
                      borderRadius: "3px",
                      background:
                        idx === activeIndex
                          ? "#ffffff"
                          : "rgba(255,255,255,0.3)",
                      transition: "background 0.3s ease",
                    }}
                  />
                ))}
              </animated.div>
            </div>
          </animated.div>
        </ParallaxLayer>
        {/* Achievements Section (First) */}
        <ParallaxLayer
          offset={4}
          sticky={{ start: 4, end: 5 }}
          style={{ zIndex: 2 }}
        >
          <div
            ref={achievementsSectionRef}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
              backgroundImage: `url(${clouds})`,
              backgroundRepeat: "repeat-x",
              backgroundPosition: "top center",
              backgroundSize: "auto 700px",
            }}
          >
            {/* Left Glass Card */}
            <div
              style={{
                flex: isMobile ? 8 : 1,
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-start",
                height: "100%",
                // display: currentPage >= 4 ? "none" : "flex",
              }}
            >
              <animated.div
                style={{
                  ...achievementCardSpring,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: "30px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1.5px solid rgba(255,255,255,0.24)",
                  color: "#111",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: "340px",
                  height: "90%",
                  position: "relative",
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 100,
                    marginBottom: "20px",
                  }}
                >
                  Achievements
                </h1>
                <ul
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.8",
                    paddingLeft: 0,
                    listStyle: "none",
                  }}
                >
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      Winner – HackFest 2024
                    </div>
                    <div style={{ color: "#555" }}>
                      1st place among 40 global teams for building an AI-based
                      Anti-Money Laundering tool.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      CodeChef 4★ | Rating: 1820
                    </div>
                    <div style={{ color: "#555" }}>
                      Global Rank 53 in Starters 112 competition.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      LeetCode
                    </div>
                    <div style={{ color: "#555" }}>
                      Top 5% globally with 3-star rating and contest rating of
                      1838.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      Google Cloud Certified
                    </div>
                    <div style={{ color: "#555" }}>
                      Professional Cloud Data Engineer – GCP.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      Microsoft Azure Certified
                    </div>
                    <div style={{ color: "#555" }}>
                      Data Engineer Associate – Azure.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      ML Medical Project
                    </div>
                    <div style={{ color: "#555" }}>
                      Awarded A-grade at Thapar University for
                      healthcare-focused ML system.
                    </div>
                  </li>
                </ul>
              </animated.div>
            </div>
            {/* Spacer for symmetry */}
            <div style={{ flex: 1 }} />
          </div>
        </ParallaxLayer>
        {/* Experience Section (Second) */}
        <ParallaxLayer
          offset={5}
          sticky={{ start: 5, end: 5 }}
          style={{ zIndex: 2 }}
        >
          <div
            ref={experiencesSectionRef}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              position: "relative",
              backgroundImage: `url(${city})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            {/* Spacer for symmetry */}
            <div style={{ flex: 1 }} />
            {/* Right Glass Card */}
            <div
              style={{
                flex: isMobile ? 8 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <animated.div
                style={{
                  ...experienceCardSpring,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: "30px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1.5px solid rgba(255,255,255,0.24)",
                  color: "#111",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: "340px",
                  height: "90%",
                  position: "relative",
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 100,
                    marginBottom: "20px",
                  }}
                >
                  Experiences
                </h1>
                <ul
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.8",
                    paddingLeft: 0,
                    listStyle: "none",
                  }}
                >
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      Software Developer (R&D) – Tredence Inc.
                    </div>
                    <div style={{ color: "#777" }}>
                      Jun 2023 – Present | Bengaluru
                    </div>
                    <div style={{ color: "#555" }}>
                      FastAPI, NextJS, Langchain, GCP – Focused on cloud
                      modernization and LLM applications.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      Intern Developer – Mantiqh Technologies
                    </div>
                    <div style={{ color: "#777" }}>
                      Jan 2023 – Jun 2023 | Bengaluru
                    </div>
                    <div style={{ color: "#555" }}>
                      Built React Native apps, enhanced booking logic, and
                      implemented automated testing.
                    </div>
                  </li>
                  <li style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "#222",
                      }}
                    >
                      Student ML Developer – Thapar University
                    </div>
                    <div style={{ color: "#777" }}>
                      Jan 2022 – Oct 2022 | Patiala
                    </div>
                    <div style={{ color: "#555" }}>
                      Designed ML models for health classification using
                      TensorFlow, Scikit-Learn.
                    </div>
                  </li>
                </ul>
              </animated.div>
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={6}
          sticky={{ start: 6, end: 6 }}
          style={{
            zIndex: 2,
          }}
        >
          <Contacts />
        </ParallaxLayer>
      </Parallax>
      {/* {currentPage >= 5 ? (
        <div
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "65rem", // <--- use px, rem, etc
          }}
        ></div>
      ) : (
        <></>
      )} */}
    </div>
  );
}
export default App;
