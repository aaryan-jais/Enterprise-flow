import React, { useState } from "react";
import { User, Mail, Briefcase, Building2, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../store/slices/authSlice";
import { useToast } from "../components/common/ToastContext";

const Profile = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Administrator",
    department:
      user?.department || "Operations",
  });

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedUser = {
      ...user,
      ...form,
    };

    dispatch(
      login({
        user: updatedUser,
        token:
          localStorage.getItem(
            "enterpriseToken"
          ),
      })
    );

    showToast(
      "Profile updated successfully"
    );
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>
            Manage your account information.
          </p>
        </div>
      </div>

      <div className="profile-page-grid">

        <div className="profile-summary-card">

          <div className="profile-large-avatar">
            {form.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <h2>{form.name}</h2>

          <p>{form.role}</p>

          <div className="profile-summary-item">
            <Mail size={16} />
            <span>{form.email}</span>
          </div>

          <div className="profile-summary-item">
            <Building2 size={16} />
            <span>
              {form.department}
            </span>
          </div>

        </div>

        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Personal Information</h2>
              <p>
                Update your profile details.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            <div className="profile-form-grid">

              <div className="form-group">
                <label>Full Name</label>

                <div className="input-icon-wrapper">
                  <User size={17} />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>

                <div className="input-icon-wrapper">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Role</label>

                <div className="input-icon-wrapper">
                  <Briefcase size={17} />

                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Department</label>

                <div className="input-icon-wrapper">
                  <Building2 size={17} />

                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            <div className="profile-form-actions">

              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save size={16} />
                Save Changes
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Profile;