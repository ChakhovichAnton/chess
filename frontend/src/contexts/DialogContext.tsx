import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  FC,
  ReactNode,
} from 'react'
import Dialog from '../components/Dialog'

interface DialogContextProps {
  openDialog: (content: ReactNode) => void
  closeDialog: () => void
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined)

export const DialogProvider: FC<PropsWithChildren> = (props) => {
  const [content, setContent] = useState<ReactNode>(null)

  const openDialog = (content: ReactNode) => setContent(content)
  const closeDialog = () => setContent(null)

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {props.children}
      <Dialog isOpen={!!content} onClose={closeDialog}>
        {content}
      </Dialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const dialogContext = useContext(DialogContext)
  if (!dialogContext) {
    throw new Error('useDialog must to be used within <DialogProvider>')
  }
  return dialogContext
}
