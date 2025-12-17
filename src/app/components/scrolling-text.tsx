// ScrollingText.tsx
import React from "react";
import "./scrolling-text.css";

interface ScrollingTextProps {
  strings: string[];
  className?: string;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({
  strings,
  className,
}) => {
  const quadruple = [
    ...strings,
    ...strings,
    ...strings,
    ...strings,
    ...strings,
    ...strings,
  ];

  // Calculate dynamic offset based on number of strings
  const dynamicOffset = strings.length * 25;

  const dynamicStyle = {
    animationName: 'scroll-up-dynamic',
    animationDuration: '10s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  };

  return (
    <div className="scroll-container">
      <div
        className={`scroll-text text-black text-6xl text-center ${className ?? ""}`}
        style={dynamicStyle}
      >
        {quadruple.map((str, index) => (
          <div key={index}>{str}</div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll-up-dynamic {
          0% {
            bottom: -${dynamicOffset}%;
          }
          100% {
            bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingText;
