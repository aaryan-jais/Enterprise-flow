import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorState = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <AlertCircle size={22} />
      </div>

      <h3>Unable to load data</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={onRetry}
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;