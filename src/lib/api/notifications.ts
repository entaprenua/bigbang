import { executeGQL } from "~/lib/graphql/server"
import {
  NOTIFICATIONS_QUERY,
  UNREAD_NOTIFICATION_COUNT_QUERY,
  MARK_NOTIFICATIONS_READ_MUTATION,
} from "~/lib/graphql/queries"
import type {
  NotificationConnection,
  Notification,
  PageInfo,
} from "../types"

interface NotificationsResult {
  notifications: NotificationConnection
}

interface UnreadCountResult {
  unreadNotificationCount: number
}

interface MarkNotificationsReadResult {
  markNotificationsRead: number
}

export interface NotificationPage {
  notifications: Notification[]
  pageInfo: PageInfo
  totalCount: number
}

export const notificationsApi = {
  getNotifications: async (
    opts: { page?: number; size?: number; first?: number; after?: string; before?: string } = {},
  ): Promise<NotificationPage> => {
    const data = await executeGQL<NotificationsResult>(NOTIFICATIONS_QUERY, opts)
    const connection = data.notifications
    return {
      notifications: connection.edges.map((e) => e.node),
      pageInfo: connection.pageInfo,
      totalCount: connection.totalCount,
    }
  },

  getUnreadCount: async (): Promise<number> => {
    const data = await executeGQL<UnreadCountResult>(UNREAD_NOTIFICATION_COUNT_QUERY)
    return data.unreadNotificationCount
  },

  markNotificationsRead: async (ids?: string[]): Promise<number> => {
    const data = await executeGQL<MarkNotificationsReadResult>(
      MARK_NOTIFICATIONS_READ_MUTATION,
      { ids },
    )
    return data.markNotificationsRead
  },
}
