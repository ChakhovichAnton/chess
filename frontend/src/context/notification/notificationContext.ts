import { createContext, useContext } from 'react'
import { NotificationContextType } from './notificationTypes'

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)

export const useNotification = () => {
  const notificationContext = useContext(NotificationContext)
  if (!notificationContext) {
    throw new Error(
      'useNotification must to be used within <NotificationProvider>',
    )
  }
  return notificationContext
}
