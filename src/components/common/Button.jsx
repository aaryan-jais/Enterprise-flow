import React from "react";
import Loader from "./Loader";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  className = "",
}) => {
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <>
          {icon && (
            <span className="btn-icon">
              {icon}
            </span>
          )}

          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;