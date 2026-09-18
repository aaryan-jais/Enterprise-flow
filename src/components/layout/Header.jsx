import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Lock,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../../store/slices/authSlice";

import ConfirmModal from "../common/ConfirmModal";
import ChangePasswordModal from "../common/ChangePasswordModal";
import NotificationPanel from "../common/NotificationPanel";

import { useToast } from "../common/ToastContext";

const Header = ({
  onMenuClick,
}) => {
  const dispatch = useDispatch();

  const {
    showToast,
  } = useToast();

  const {
    user,
  } = useSelector(
    (state) => state.auth
  );

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    logoutModal,
    setLogoutModal,
  ] = useState(false);

  const [
    passwordModal,
    setPasswordModal,
  ] = useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([
    {
      id: 1,
      title: "Project updated",
      message:
        "Enterprise CRM project was updated.",
      time: "5 min ago",
      type: "project",
      read: false,
    },
    {
      id: 2,
      title: "New user added",
      message:
        "A new user was added to the system.",
      time: "25 min ago",
      type: "user",
      read: false,
    },
    {
      id: 3,
      title: "Report generated",
      message:
        "Monthly operations report is ready.",
      time: "1 hour ago",
      type: "success",
      read: true,
    },
  ]);

  const profileRef =
    useRef(null);

  const notificationRef =
    useRef(null);

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());

    showToast(
      "Logged out successfully"
    );

    setLogoutModal(false);
  };

  const markNotificationRead = (
    id
  ) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);

    showToast(
      "Notifications cleared"
    );
  };

  const userName =
    user?.name ||
    "Administrator";

  const userEmail =
    user?.email ||
    "admin@enterprise.com";

  const userRole =
    user?.role ||
    "Administrator";

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  return (
    <>
      <header className="top-header">

        <div className="header-left">

          <button
            className="mobile-menu-btn"
            onClick={onMenuClick}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="header-title">
            <span>
              Enterprise Operations
            </span>
          </div>

        </div>

        <div className="header-right">

          {/* Notifications */}

          <div
            className="notification-wrapper"
            ref={notificationRef}
          >
            <button
              className="notification-btn"
              onClick={() => {
                setNotificationOpen(
                  !notificationOpen
                );

                setProfileOpen(false);
              }}
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <NotificationPanel
                notifications={
                  notifications
                }
                onClose={() =>
                  setNotificationOpen(
                    false
                  )
                }
                onRead={
                  markNotificationRead
                }
                onClear={
                  clearNotifications
                }
              />
            )}
          </div>

          {/* Profile */}

          <div
            className="profile-wrapper"
            ref={profileRef}
          >
            <button
              className="profile-trigger"
              onClick={() => {
                setProfileOpen(
                  !profileOpen
                );

                setNotificationOpen(
                  false
                );
              }}
            >
              <div className="avatar">
                {userName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-info">
                <strong>
                  {userName}
                </strong>

                <span>
                  {userRole}
                </span>
              </div>

              <ChevronDown
                size={16}
                className={
                  profileOpen
                    ? "chevron rotate"
                    : "chevron"
                }
              />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">

                <div className="dropdown-user">

                  <div className="avatar large">
                    {userName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {userName}
                    </strong>

                    <span>
                      {userEmail}
                    </span>
                  </div>

                </div>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item"
                  onClick={() => {
                    window.location.href =
                      "/profile";
                  }}
                >
                  <User size={17} />
                  Profile
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    window.location.href =
                      "/settings";
                  }}
                >
                  <Settings size={17} />
                  Settings
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    setPasswordModal(true);
                  }}
                >
                  <Lock size={17} />
                  Change Password
                </button>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item danger-text"
                  onClick={() => {
                    setProfileOpen(false);
                    setLogoutModal(true);
                  }}
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      <ConfirmModal
        isOpen={logoutModal}
        title="Logout"
        message="Are you sure you want to logout from EnterpriseFlow?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() =>
          setLogoutModal(false)
        }
      />

      <ChangePasswordModal
        isOpen={passwordModal}
        onClose={() =>
          setPasswordModal(false)
        }
      />
    </>
  );
};

export default Header;