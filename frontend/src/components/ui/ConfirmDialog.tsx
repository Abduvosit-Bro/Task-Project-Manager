import Modal from './Modal'
import Button from './Button'

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}) => {
  return (
    <Modal title={title} open={open} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-2">
          <Button className="bg-gray-200 text-gray-700" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
