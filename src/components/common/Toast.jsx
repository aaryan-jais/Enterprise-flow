import React from "react";
import {
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

const Toast = ({
  type = "success",
  message,
  onClose,
}) => {
  return (
    <div
      className={`toast toast-${type}`}
    >
      <div className="toast-icon">
        {type === "success" ? (
          <CheckCircle size={20} />
        ) : (
          <XCircle size={20} />
        )}
      </div>

      <span className="toast-message">
        {message}
      </span>

      <button
        className="toast-close"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;