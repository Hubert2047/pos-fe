import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExpenseTable } from './ExpenseTable'
type Props = {
    open: boolean
    onClose: () => void
}
export default function ExpenseTableDialog({ open, onClose }: Props) {
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
            <DialogContent className='w-fit'>
                <DialogHeader>
                    <DialogTitle className='text-black! font-bold! text-xl'>Bảng Chi Phí</DialogTitle>
                </DialogHeader>
                <ExpenseTable />
            </DialogContent>
        </Dialog>
    )
}
