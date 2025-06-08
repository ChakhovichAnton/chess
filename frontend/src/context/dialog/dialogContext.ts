import { createContext, ReactNode, useContext } from 'react'

interface DialogContextType {
  openDialog: (content: ReactNode) => void
  closeDialog: () => void
}

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined,
)

export const useDialog = () => {
  const dialogContext = useContext(DialogContext)
  if (!dialogContext) {
    throw new Error('useDialog must to be used within <DialogProvider>')
  }
  return dialogContext
}
