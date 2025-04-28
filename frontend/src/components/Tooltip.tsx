import { FC, PropsWithChildren } from 'react'

interface TooltipProps extends PropsWithChildren {
  text: string
}

const Tooltip: FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative flex flex-col items-center group w-fit h-fit">
      {children}
      <div className="absolute bottom-full hidden items-center group-hover:flex mb-1">
        <span className="relative z-10 p-1.5 text-sm leading-none whitespace-nowrap shadow-lg rounded bg-white">
          {text}
        </span>
      </div>
    </div>
  )
}

export default Tooltip
