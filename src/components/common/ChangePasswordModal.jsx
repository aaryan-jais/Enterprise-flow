import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import Modal from "./Modal";
import { useToast } from "./ToastContext";

const ChangePasswordModal = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.currentPassword !== "123456") {
      showToast(
        "Current password is incorrect",
        "error"
      );
      return;
    }

    if (form.newPassword.length < 6) {
      showToast(
        "New password must contain at least 6 characters",
        "error"
      );
      return;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      showToast(
        "Passwords do not match",
        "error"
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        "enterprisePassword",
        form.newPassword
      );

      setLoading(false);

      showToast(
        "Password changed successfully"
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
    >
      <form
        className="password-form"
        onSubmit={handleSubmit}
      >
        <div className="password-info">
          <Lock size={18} />

          <span>
            Your password must contain at
            least 6 characters.
          </span>
        </div>

        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          visible={showPassword.current}
          onToggle={() =>
            togglePassword("current")
          }
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          visible={showPassword.new}
          onToggle={() =>
            togglePassword("new")
          }
        />

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          visible={showPassword.confirm}
          onToggle={() =>
            togglePassword("confirm")
          }
        />

        <div className="password-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="password-input-wrapper">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={onToggle}
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;