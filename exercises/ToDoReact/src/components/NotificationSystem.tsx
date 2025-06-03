import React from "react";
import { useNotifications, type Notification } from "../store/clientStore";
import { Ban, BellRing, Info, X } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const getStyles = (type: Notification["type"]) => {
    const baseStyles =
      "border-l-4 p-4 rounded-r-lg shadow-xl backdrop-blur-sm border-2";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-900/95 border-l-green-400 border-amber-300 text-amber-100`;
      case "error":
        return `${baseStyles} bg-red-900/95 border-l-red-400 border-amber-300 text-amber-100`;
      case "warning":
        return `${baseStyles} bg-orange-900/95 border-l-orange-400 border-amber-300 text-amber-100`;
      case "info":
        return `${baseStyles} bg-amber-900/95 border-l-amber-400 border-amber-300 text-amber-100`;
      default:
        return `${baseStyles} bg-amber-950/95 border-l-amber-600 border-amber-300 text-amber-100`;
    }
  };

  const getIcon = (type: Notification["type"]) => {
    const iconClass = "w-5 h-5 text-amber-300";

    switch (type) {
      case "success":
        return <BellRing />;
      case "error":
        return <Ban />;
      case "warning":
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return <Info />;
    }
  };

  const getTitle = (type: Notification["type"], title: string) => {
    switch (type) {
      case "success":
        return `🍀 ${title}`;
      case "error":
        return `🍺 ${title}`;
      case "warning":
        return `⚠️ ${title}`;
      case "info":
        return `📋 ${title}`;
      default:
        return title;
    }
  };

  return (
    <div
      className={`${getStyles(
        notification.type
      )} transform transition-all duration-300 ease-in-out animate-slide-in bg-amber-950/95`}
    >
      <div className="flex items-start relative">
        <div className="flex-shrink-0 bg-amber-00/50 rounded-full p-2 border border-amber-400">
          {getIcon(notification.type)}
        </div>

        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-amber-200 drop-shadow-sm">
            {getTitle(notification.type, notification.title)}
          </p>
          {notification.message && (
            <p className="mt-1 text-sm text-amber-100/90 font-medium">
              {notification.message}
            </p>
          )}
        </div>

        {/*CLOSE BUTTON*/}
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onClose(notification.id)}
            className="inline-flex rounded-full bg-amber-800/30 hover:bg-amber-700/50 border border-amber-400/50 p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-900 transition-all duration-200"
            title="Cerrar notificación"
          >
            <span className="sr-only">Close</span>
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;
