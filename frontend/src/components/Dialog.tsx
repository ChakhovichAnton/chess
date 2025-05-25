import { FC, PropsWithChildren, useEffect, useRef } from 'react'

interface DialogProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
}

const Dialog: FC<DialogProps> = (props) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node | null)
      ) {
        props.onClose()
      }
    }

    if (props.isOpen) {
      window.addEventListener('click', handleClickOutside)
    } else {
      window.removeEventListener('click', handleClickOutside)
    }

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [props.isOpen, props.onClose])

  if (!props.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div ref={dialogRef} className="bg-white rounded-2xl p-6 shadow-xl">
        {props.children}
      </div>
    </div>
  )
}

export default Dialog
