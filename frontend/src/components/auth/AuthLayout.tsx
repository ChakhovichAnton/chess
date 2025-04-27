import { FC, PropsWithChildren } from 'react'

interface AuthLayoutProps extends PropsWithChildren {
  title: string
}

const AuthLayout: FC<AuthLayoutProps> = (props) => {
  return (
    <div className="flex justify-center px-2">
      <div className="max-w-md flex flex-col gap-8 bg-white rounded-md w-full p-10">
        <h1 className="text-3xl text-center font-medium">{props.title}</h1>
        {props.children}
      </div>
    </div>
  )
}

export default AuthLayout
