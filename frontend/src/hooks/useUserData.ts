import { useState, useEffect } from 'react'
import { PageStatus, User } from '../types'
import { isAxiosError } from 'axios'
import { getUser } from '../services/userServices'

const useUserData = (userId?: number) => {
  const [status, setStatus] = useState<PageStatus>('loading')
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    if (userId === undefined) return

    const getUserData = async () => {
      setStatus('loading')
      try {
        const user = await getUser(userId)
        setUser(user)
        setStatus('success')
      } catch (e) {
        if (isAxiosError(e) && e.status === 404) {
          setStatus('notFound')
        } else {
          setStatus('error')
        }
      }
    }

    getUserData()
  }, [userId])

  return { status, user }
}

export default useUserData
