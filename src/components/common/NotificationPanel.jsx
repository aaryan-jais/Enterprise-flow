import React from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  FolderKanban,
  UserPlus,
  X,
} from "lucide-react";

const NotificationPanel = ({
  notifications,
  onClose,
  onRead,
  onClear,
}) => {
  const getIcon = (type) => {
    if (type === "project") {
      return <FolderKanban size={17} />;
    }

    if (type === "user") {
      return <UserPlus size={17} />;
    }

    if (type === "success") {
      return <CheckCircle size={17} />;
    }

    return <Clock size={17} />;
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <div>
          <h3>Notifications</h3>

          <span>
            {notifications.length} notifications
          </span>
        </div>

        <button
          onClick={onClose}
          className="notification-close"
        >
          <X size={17} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <Bell size={28} />

          <p>No notifications</p>

          <span>
            You're all caught up.
          </span>
        </div>
      ) : (
        <>
          <div className="notification-list">
            {notifications.map(
              (notification) => (
                <button
                  key={notification.id}
                  className={`notification-item ${
                    notification.read
                      ? "read"
                      : "unread"
                  }`}
                  onClick={() =>
                    onRead(notification.id)
                  }
                >
                  <div
                    className={`notification-icon ${notification.type}`}
                  >
                    {getIcon(
                      notification.type
                    )}
                  </div>

                  <div className="notification-content">
                    <strong>
                      {notification.title}
                    </strong>

                    <p>
                      {notification.message}
                    </p>

                    <span>
                      {notification.time}
                    </span>
                  </div>

                  {!notification.read && (
                    <span className="unread-dot" />
                  )}
                </button>
              )
            )}
          </div>

          <div className="notification-footer">
            <button onClick={onClear}>
              Clear all notifications
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;