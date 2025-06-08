import { useState, useEffect, useRef } from 'react'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'
import { refreshAccessToken } from '../utils/accessToken'
import { useNotification } from '../context/notification'

type Status = 'loading' | 'error' | 'connected' | 'disconnected'

/**
 * A helper hook for WebSocket connections with access token refreshing
 * @param path in the backend without a beginning or a trailing forward slash
 * @param onMessage callback for WebSocket
 * @param autoConnect set to true, if the WebSocket should be automatically connected
 */
export const UseWebSocket = (
  path: string,
  onMessage: (ev: MessageEvent) => void,
  autoConnect?: boolean,
  onClose?: () => void,
  onError?: () => void,
) => {
  const { addNotification } = useNotification()
  const [status, setStatus] = useState<Status>('disconnected')
  const socketRef = useRef<WebSocket | undefined>(undefined)
  const retryRef = useRef(false) // If connection retry has been attempted; for example, due to invalid credentials

  /** Connects to WebSocket only if the connection does not exist */
  const initializeSocket = () => {
    // Do not connect if the WebSocket is already connecting or connected
    if (status === 'loading' || status === 'connected') return

    setStatus('loading')

    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/${path}/?token=${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`,
    )
    socketRef.current.onopen = () => setStatus('connected')

    socketRef.current.onmessage = (event) => {
      retryRef.current = false // Allow a retry after a new message
      onMessage(event)
    }

    socketRef.current.onerror = () => {
      setStatus('error')
      if (onError) onError()
    }
    socketRef.current.onclose = async (closeEvent) => {
      // If event code is 1006, refresh access token and reconnect
      if (closeEvent.code === 1006 && !retryRef.current) {
        setStatus('loading')
        if (onClose) onClose()
        await refreshAccessToken()
        initializeSocket()
        retryRef.current = true
      } else {
        setStatus('disconnected')
      }
    }
  }

  const disconnect = () => {
    if (status === 'connected' || status === 'loading') {
      socketRef.current?.close()
      socketRef.current = undefined
      setStatus('loading')
    }
  }

  // Initialize WebSocket connection only if autoConnect is true
  useEffect(() => {
    if (autoConnect) initializeSocket()

    return () => disconnect()
  }, [autoConnect])

  const sendMessage = (message: object) => {
    if (
      socketRef.current?.readyState === WebSocket.OPEN &&
      status === 'connected'
    ) {
      socketRef.current.send(JSON.stringify(message))
    } else {
      addNotification('Error: connection failure', 'error')
    }
  }

  return { sendMessage, status, connect: initializeSocket, disconnect }
}
