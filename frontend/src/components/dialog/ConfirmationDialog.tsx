import { FC } from 'react'
import Dialog from './Dialog'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} closeDialogButton>
      <div className="relative min-h-[30vh] w-full max-w-md text-center flex flex-col justify-center items-center">
        <h2 className="text-3xl font-semibold mb-2">{title}</h2>
        <p className="mb-10">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-background-gray-light text-white rounded-lg hover:bg-background-gray"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmationDialog
