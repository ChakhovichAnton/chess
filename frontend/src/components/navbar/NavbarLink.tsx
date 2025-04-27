import { FC } from 'react'

interface NavbarLinkProps {
  text: string
  href: string
}

const NavbarLink: FC<NavbarLinkProps> = (props) => {
  return (
    <a
      className="hover:cursor-pointer hover:bg-gray-100 border px-2 py-1 rounded-lg"
      href={props.href}
    >
      {props.text}
    </a>
  )
}

export default NavbarLink
