import { useEffect, useRef } from 'react'

const useSyncRef = <T>(value: T) => {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref
}

export default useSyncRef
