import React from "react";
import { AlertCircle } from "lucide-react";

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="form-error">
      <AlertCircle size={13} />
      <span>{message}</span>
    </div>
  );
};

export default FormError;