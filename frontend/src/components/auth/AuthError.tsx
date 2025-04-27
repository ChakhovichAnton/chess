import { FC } from 'react'

interface AuthErrorProps {
  error?: string
}

const AuthError: FC<AuthErrorProps> = (props) => {
  if (!props.error) return null

  return <p className="-mb-4 -mt-7 text-red-500">{props.error}</p>
}

export default AuthError
