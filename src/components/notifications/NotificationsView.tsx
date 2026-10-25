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
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Top Header Card */}
      <div className="card-linkedin p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#173a35] tracking-tight">
              Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-[#62736b] mt-1">
              Updates on student requests, research discussions, and deadlines
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="btn-3d-secondary flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-black/[0.05]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-xs"
            }`}
          >
            All Activity ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`text-xs px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
              filter === "unread"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-xs"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card-linkedin divide-y divide-black/[0.04] overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#62736b]">
            <Bell className="w-10 h-10 text-[#87978f] mx-auto mb-2.5 opacity-40" />
            <p className="font-bold text-base text-[#173a35]">
              No notifications at this moment
            </p>
            <p className="mt-1 text-xs">
              {filter === "unread"
                ? "You are all caught up on your unread updates."
                : "Activity from your connections and deadlines will appear here."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                !notif.isRead ? "bg-[#f4f7f5]" : "bg-white hover:bg-[#fbfcfb]"
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] shadow-xs flex items-center justify-center shrink-0 mt-0.5">
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
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        onAcceptConnection(notif.actorId!)
                        onMarkAsRead(notif.id)
                      }}
                      className="btn-3d-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1 cursor-pointer"
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
                      className="btn-3d-secondary px-3.5 py-1.5 text-[#62736b] hover:text-[#a33e32] text-xs font-medium cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile(notif.actorId!)}
                      className="text-xs text-[#c46b4b] hover:underline ml-2 cursor-pointer font-medium"
                    >
                      View Profile
                    </button>
                  </div>
                )}

                {/* Inline Action for Post Comments & Opportunities */}
                {notif.targetId && notif.type !== "connection_request" && (
                  <div className="mt-2.5">
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
                      className="text-xs text-[#173a35] font-semibold hover:underline cursor-pointer"
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
                  className="w-2.5 h-2.5 rounded-full bg-[#c46b4b] shrink-0 mt-2 shadow-xs cursor-pointer"
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
