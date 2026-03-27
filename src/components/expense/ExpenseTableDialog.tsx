import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExpenseTable } from './ExpenseTable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteExpense, getExpenses, type Expense } from '@/api/expense'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'

type Props = {
    open: boolean
    onClose: () => void
}
export default function ExpenseTableDialog({ open, onClose }: Props) {
    const queryClient = useQueryClient()

    const { data: expenses = [], isLoading } = useQuery<Expense[], Error>({
        queryKey: ['expenses'],
        queryFn: getExpenses,
        staleTime: 5 * 60 * 1000,
    })
    const deleteMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast('Xóa thành công')
        },
        onError: () => {
            toast('Xóa thất bại')
        },
    })
    const handleDelete = (id: string) => {
        deleteMutation.mutate(id)
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <Spinner />
            </div>
        )
    }
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
            <DialogContent className="min-w-max max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle className='text-black! font-bold! text-xl'>Bảng Chi Phí</DialogTitle>
                </DialogHeader>
                <ExpenseTable expenses={expenses} handleDelete={handleDelete} deleteMutation={deleteMutation}/>
            </DialogContent>
        </Dialog>
    )
}
