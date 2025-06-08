import { FC, PropsWithChildren, useEffect, useRef } from 'react'

interface DialogProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
}

const Dialog: FC<DialogProps> = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window) return

    // Close dialog if the user clicks outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node | null)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('click', handleClickOutside)
    } else {
      window.removeEventListener('click', handleClickOutside)
    }

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div ref={dialogRef} className="bg-white rounded-2xl p-6 shadow-xl">
        {children}
      </div>
    </div>
  )
}

export default Dialog
