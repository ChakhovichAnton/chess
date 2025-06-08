export type NotificationType = 'error' | 'success' | 'info'

export interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void
}

export interface Notification {
  id: string
  message: string
  type: NotificationType
}
