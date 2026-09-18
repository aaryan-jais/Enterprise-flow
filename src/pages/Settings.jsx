import React, { useState } from "react";
import {
  Bell,
  Shield,
  Palette,
  Save,
} from "lucide-react";

import { useToast } from "../components/common/ToastContext";

const Settings = () => {
  const { showToast } = useToast();

  const [settings, setSettings] =
    useState({
      emailNotifications: true,
      projectNotifications: true,
      securityAlerts: true,
      compactMode: false,
    });

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "enterpriseSettings",
      JSON.stringify(settings)
    );

    showToast(
      "Settings saved successfully"
    );
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage application preferences.
          </p>
        </div>
      </div>

      <div className="settings-container">

        <div className="dashboard-card">

          <div className="settings-section">

            <div className="settings-section-header">
              <div className="settings-section-icon">
                <Bell size={19} />
              </div>

              <div>
                <h2>
                  Notifications
                </h2>

                <p>
                  Control how EnterpriseFlow
                  notifies you.
                </p>
              </div>
            </div>

            <SettingRow
              title="Email Notifications"
              description="Receive important updates through email."
              checked={
                settings.emailNotifications
              }
              onChange={() =>
                handleToggle(
                  "emailNotifications"
                )
              }
            />

            <SettingRow
              title="Project Notifications"
              description="Get notified when project information changes."
              checked={
                settings.projectNotifications
              }
              onChange={() =>
                handleToggle(
                  "projectNotifications"
                )
              }
            />

          </div>

          <div className="settings-divider" />

          <div className="settings-section">

            <div className="settings-section-header">
              <div className="settings-section-icon">
                <Shield size={19} />
              </div>

              <div>
                <h2>
                  Security
                </h2>

                <p>
                  Manage account security alerts.
                </p>
              </div>
            </div>

            <SettingRow
              title="Security Alerts"
              description="Receive notifications for important security events."
              checked={
                settings.securityAlerts
              }
              onChange={() =>
                handleToggle(
                  "securityAlerts"
                )
              }
            />

          </div>

          <div className="settings-divider" />

          <div className="settings-section">

            <div className="settings-section-header">
              <div className="settings-section-icon">
                <Palette size={19} />
              </div>

              <div>
                <h2>
                  Appearance
                </h2>

                <p>
                  Customize your dashboard experience.
                </p>
              </div>
            </div>

            <SettingRow
              title="Compact Mode"
              description="Use a more compact dashboard layout."
              checked={
                settings.compactMode
              }
              onChange={() =>
                handleToggle(
                  "compactMode"
                )
              }
            />

          </div>

          <div className="settings-actions">

            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Settings
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

const SettingRow = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="setting-row">

      <div>
        <strong>{title}</strong>

        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
        aria-label={title}
      >
        <span />
      </button>

    </div>
  );
};

export default Settings;