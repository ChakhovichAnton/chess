import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  FC,
} from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { createId } from '../utils/createId'

const DISPLAY_TIME_MS = 3000

type NotificationType = 'error' | 'success' | 'info'

interface Notification {
  id: string
  message: string
  type: NotificationType
}

interface NotificationContextProps {
  addNotification: (message: string, type: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
)

export const NotificationProvider: FC<PropsWithChildren> = (props) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    )
  }

  const addNotification = (message: string, type: NotificationType) => {
    const id = createId()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeNotification(id), DISPLAY_TIME_MS)
  }

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {props.children}
      <div className="fixed bottom-8 right-8 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`relative max-w-96 px-4 py-2 rounded shadow-lg transition-all
              ${notification.type === 'success' && 'bg-green-500 text-white'}
              ${notification.type === 'error' && 'bg-red-500 text-white'}
              ${notification.type === 'info' && 'bg-white text-black'}
            `}
          >
            <button
              className="absolute hover:cursor-pointer top-0 right-0"
              onClick={() => removeNotification(notification.id)}
            >
              <IoCloseSharp size={20} />
            </button>
            <div>{notification.message}</div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const UseNotification = () => {
  const notificationContext = useContext(NotificationContext)

  if (!notificationContext) {
    throw new Error(
      'UseNotification must to be used within <NotificationProvider>',
    )
  }

  return notificationContext
}
