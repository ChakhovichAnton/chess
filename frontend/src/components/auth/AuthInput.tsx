import { FC } from 'react'

interface AuthInputProps {
  label: string
  id: string
  value: string
  type?: React.HTMLInputTypeAttribute
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder: string
  disabled: boolean
}

const AuthInput: FC<AuthInputProps> = (props) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        value={props.value}
        type={props.type}
        onChange={props.onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className="border rounded-md p-2"
      />
    </div>
  )
}

export default AuthInput
