import React, { useState } from "react"
import {
  Bell,
  CheckCircle,
  MessageSquare,
  Heart,
  UserPlus,
  Clock,
  Info,
  Check,
  CheckCheck,
} from "lucide-react"
import { AppNotification, NotificationType } from "../../types"

interface NotificationsViewProps {
  notifications: AppNotification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onAcceptConnection: (userId: string) => void
  onDeclineConnection: (userId: string) => void
  onNavigateToTab: (tab: any) => void
  onSelectStudentProfile: (userId: string) => void
}

export function NotificationsView({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onAcceptConnection,
  onDeclineConnection,
  onNavigateToTab,
  onSelectStudentProfile,
}: NotificationsViewProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true,
  )

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "connection_request":
      case "connection_accepted":
        return <UserPlus className="w-4 h-4 text-[#173a35]" />
      case "comment":
      case "reply":
      case "message":
        return <MessageSquare className="w-4 h-4 text-[#0369a1]" />
      case "like":
        return <Heart className="w-4 h-4 text-[#c46b4b] fill-current" />
      case "opportunity_alert":
        return <Clock className="w-4 h-4 text-[#b45309]" />
      case "announcement":
      default:
        return <Info className="w-4 h-4 text-[#173a35]" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-5">
      {/* Top Header Card */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#173a35] tracking-tight">
              Notification Center
            </h1>
            <p className="text-xs text-[#62736b] mt-0.5">
              Updates on student requests, research discussions, and deadlines
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f7f5ef] border border-[#cbd3ce] text-[#173a35] rounded-[2px] text-xs font-semibold hover:bg-[#e8ece9] transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#eef2ef]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs px-3 py-1 rounded-[2px] font-semibold transition-colors ${
              filter === "all"
                ? "bg-[#173a35] text-white"
                : "bg-[#f7f5ef] text-[#62736b] hover:text-[#173a35]"
            }`}
          >
            All Activity ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`text-xs px-3 py-1 rounded-[2px] font-semibold transition-colors ${
              filter === "unread"
                ? "bg-[#173a35] text-white"
                : "bg-[#f7f5ef] text-[#62736b] hover:text-[#173a35]"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] divide-y divide-[#eef2ef] overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#62736b]">
            <Bell className="w-8 h-8 text-[#87978f] mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm text-[#173a35]">
              No notifications at this moment
            </p>
            <p className="mt-1">
              {filter === "unread"
                ? "You are all caught up on your unread updates."
                : "Activity from your connections and deadlines will appear here."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start gap-3.5 transition-colors ${
                !notif.isRead ? "bg-[#f0ede6]" : "bg-white hover:bg-[#fbfaf7]"
              }`}
            >
              <div className="w-9 h-9 rounded-[2px] bg-white border border-[#cbd3ce] flex items-center justify-center shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-[#173a35]">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-[#728078] shrink-0 font-mono">
                    {notif.createdAt}
                  </span>
                </div>

                <p className="text-xs text-[#242b29] mt-0.5 leading-relaxed">
                  {notif.description}
                </p>

                {/* Inline Action for Connection Requests */}
                {notif.type === "connection_request" && notif.actorId && (
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onAcceptConnection(notif.actorId!)
                        onMarkAsRead(notif.id)
                      }}
                      className="px-3 py-1 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeclineConnection(notif.actorId!)
                        onMarkAsRead(notif.id)
                      }}
                      className="px-3 py-1 bg-white border border-[#cbd3ce] text-[#62736b] hover:text-[#a33e32] rounded-[2px] text-xs font-medium"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile(notif.actorId!)}
                      className="text-xs text-[#c46b4b] hover:underline ml-2"
                    >
                      View Profile
                    </button>
                  </div>
                )}

                {/* Inline Action for Post Comments & Opportunities */}
                {notif.targetId && notif.type !== "connection_request" && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onMarkAsRead(notif.id)
                        if (notif.type === "opportunity_alert") {
                          onNavigateToTab("opportunities")
                        } else {
                          onNavigateToTab("feed")
                        }
                      }}
                      className="text-xs text-[#173a35] font-semibold hover:underline"
                    >
                      View Update →
                    </button>
                  </div>
                )}
              </div>

              {!notif.isRead && (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(notif.id)}
                  className="w-2.5 h-2.5 rounded-[2px] bg-[#c46b4b] shrink-0 mt-2"
                  title="Mark as read"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
