import React from "react";
import FormError from "./FormError";

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  error = "",
  disabled = false,
  children,
}) => {
  return (
    <div className="form-group">

      <label htmlFor={name}>
        {label}

        {required && (
          <span className="required-mark">
            *
          </span>
        )}
      </label>

      {children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={
            error
              ? "form-input-error"
              : ""
          }
        />
      )}

      <FormError message={error} />

    </div>
  );
};

export default FormField;