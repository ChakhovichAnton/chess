import { useState, PropsWithChildren, FC, ReactNode } from 'react'
import Dialog from '../../components/dialog/Dialog'
import { DialogContext } from './dialogContext'

export const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [content, setContent] = useState<ReactNode>(null)

  const openDialog = (content: ReactNode) => setContent(content)
  const closeDialog = () => setContent(null)

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog isOpen={!!content} onClose={closeDialog}>
        {content}
      </Dialog>
    </DialogContext.Provider>
  )
}
