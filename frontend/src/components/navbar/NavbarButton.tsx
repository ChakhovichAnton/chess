import { FC } from 'react'

interface NavbarButtonProps {
  text: string
  onClick: () => void
  disabled: boolean
}

const NavbarButton: FC<NavbarButtonProps> = (props) => {
  return (
    <button
      className="hover:cursor-pointer hover:bg-gray-100 border px-2 py-1 rounded-lg"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  )
}

export default NavbarButton
