import React from "react";

const DateFilter = ({
  value,
  onChange,
}) => {
  return (
    <div className="date-filter">
      <button
        className={
          value === "7d"
            ? "active"
            : ""
        }
        onClick={() =>
          onChange("7d")
        }
      >
        7 Days
      </button>

      <button
        className={
          value === "30d"
            ? "active"
            : ""
        }
        onClick={() =>
          onChange("30d")
        }
      >
        30 Days
      </button>

      <button
        className={
          value === "90d"
            ? "active"
            : ""
        }
        onClick={() =>
          onChange("90d")
        }
      >
        90 Days
      </button>

      <button
        className={
          value === "1y"
            ? "active"
            : ""
        }
        onClick={() =>
          onChange("1y")
        }
      >
        1 Year
      </button>
    </div>
  );
};

export default DateFilter;