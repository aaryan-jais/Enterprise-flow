import React from "react";

const Loader = ({
  size = "normal",
}) => {
  return (
    <div
      className={`loader-wrapper loader-${size}`}
    >
      <div className="loader-spinner" />
    </div>
  );
};

export default Loader;