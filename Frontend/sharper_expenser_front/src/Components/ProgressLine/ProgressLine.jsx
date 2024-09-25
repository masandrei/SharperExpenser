import { useEffect, useMemo, useState } from "react";
import "./ProgressLine.css";

const ProgressLine = ({
  backgroundColor = "#e5e5e5",
  data = {
    amountAtTheStartOfMonth: 0,
    additionalAmount: 0,
    currency: "",
    moneyToGather: 0,
  },
}) => {
  const generatePercentages = (goal) => {
    const startPercentage =
      ((goal?.amountAtTheStartOfMonth + Math.min(0, goal?.additionalAmount)) /
        goal?.moneyToGather) *
      100;
    console.log(startPercentage);
    const additionalPercentage =
      ((goal?.additionalAmount > 0
        ? Math.min(
            goal?.additionalAmount,
            goal?.moneyToGather - goal?.amountAtTheStartOfMonth
          )
        : Math.min(
            Math.abs(goal?.additionalAmount),
            goal?.amountAtTheStartOfMonth
          )) /
        goal?.moneyToGather) *
      100;

    return [
      {
        percentage: `${startPercentage}%`,
        backgroundColor: "#4C9900",
      },
      {
        percentage: `${additionalPercentage}%`,
        backgroundColor: goal?.additionalAmount > 0 ? "#66FF66" : "#990000",
      },
    ];
  };
  const visualParts = useMemo(() => generatePercentages(data), [data]);
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
