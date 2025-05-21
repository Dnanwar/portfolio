import React, { useEffect, useState } from "react";

const TypingText = ({
  message = "",
  speed = 100,
  start = false,
  onComplete,
}) => {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!start) return;

    let index = 0;
    setText("");

    const type = () => {
      if (index <= message.length) {
        setText(message.slice(0, index));
        index++;
        setTimeout(type, speed);
      } else {
        // wait 1 extra tick before calling onComplete
        if (onComplete) {
          setTimeout(onComplete, speed);
        }
      }
    };

    type();
  }, [start, message, speed, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "70px" }}>
      <span
        style={{
          color: "black",
          fontSize: "2rem",
          fontWeight: 100,
          letterSpacing: "0.05em",
          margin: 0,
        }}
      >
        {text}
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
      </span>
    </div>
  );
};

export default TypingText;
