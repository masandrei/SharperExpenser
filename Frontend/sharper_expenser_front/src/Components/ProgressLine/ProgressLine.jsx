import { useEffect, useState } from "react";
import "./ProgressLine.css";

const ProgressLine = ({
  backgroundColor = "#e5e5e5",
  visualParts = [
    {
      percentage: "0%",
      backgroundColor: "white",
    },
  ],
}) => {
  const [width, setWidths] = useState(visualParts.map(() => 0));

  useEffect(() => {
    requestAnimationFrame(() => {
      setWidths(visualParts.map((part) => part.percentage));
    });
  }, [visualParts]);

  return (
    <>
      <div className="progress-visual-full" style={{ backgroundColor }}>
        {visualParts.map((part, index) => {
          return (
            <div
              className="progress-visual-parts"
              key={index}
              style={{
                width: width[index],
                backgroundColor: part.backgroundColor,
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default ProgressLine;
