import { useState, useEffect, useRef, useCallback } from 'react'
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
const useWebSocket = (
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

  const disconnect = useCallback(() => {
    socketRef.current?.close()
    socketRef.current = undefined
    setStatus('disconnected')
  }, [])

  // Initialize WebSocket connection only if autoConnect is true
  useEffect(() => {
    if (!autoConnect) return

    /** Connects to WebSocket only if the connection does not exist */
    const initializeSocket = async () => {
      if (socketRef.current) return
      setStatus('loading')
      await refreshAccessToken() // Refresch access token before connecting to increase connection length

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
          await initializeSocket()
          retryRef.current = true
        } else {
          setStatus('disconnected')
        }
      }
    }

    initializeSocket()

    return () => disconnect()
  }, [autoConnect, onClose, onError, onMessage, path, disconnect])

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

  return { sendMessage, status, disconnect }
}

export default useWebSocket
