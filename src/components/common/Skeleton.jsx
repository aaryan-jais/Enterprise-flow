import React from "react";

const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "6px",
  className = "",
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const SkeletonText = ({
  width = "100%",
  height = "14px",
}) => (
  <Skeleton
    width={width}
    height={height}
  />
);

export const SkeletonAvatar = ({
  size = 40,
}) => (
  <Skeleton
    width={`${size}px`}
    height={`${size}px`}
    borderRadius="50%"
  />
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton width="40px" height="40px" />
    <Skeleton width="55%" height="14px" />
    <Skeleton width="80%" height="11px" />
  </div>
);

export const SkeletonTable = ({
  rows = 6,
  columns = 5,
}) => (
  <div className="skeleton-table">

    {Array.from({ length: rows }).map(
      (_, rowIndex) => (
        <div
          className="skeleton-table-row"
          key={rowIndex}
        >
          {Array.from({
            length: columns,
          }).map(
            (_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                width={
                  columnIndex === 0
                    ? "65%"
                    : "80%"
                }
                height="13px"
              />
            )
          )}
        </div>
      )
    )}

  </div>
);

export default Skeleton;