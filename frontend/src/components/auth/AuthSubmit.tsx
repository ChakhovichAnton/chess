import { FC } from 'react'

interface AuthSubmitProps {
  text: string
  disabled: boolean
}

const AuthSubmit: FC<AuthSubmitProps> = (props) => {
  return (
    <button
      type="submit"
      disabled={props.disabled}
      className="bg-light-blue hover:brightness-110 disabled:grayscale disabled:brightness-100 text-white rounded-md p-2 hover:cursor-pointer disabled:cursor-default"
    >
      {props.text}
    </button>
  )
}

export default AuthSubmit
