import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {ExpenseTable} from './ExpenseTable'
import { useQuery} from '@tanstack/react-query'
import {getExpenses, type Expense} from '@/api/expense'
import Loading from "@/components/Loading.tsx";

type Props = {
    open: boolean
    onClose: () => void
}
export default function ExpenseTableDialog({open, onClose}: Props) {
    const {data: expenses = [], isLoading} = useQuery<Expense[], Error>({
        queryKey: ['expenses'],
        queryFn: () => getExpenses(),
        staleTime: 5 * 60 * 1000,
    })
    if (isLoading) {
        return <Loading/>
    }
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
            <DialogContent className="min-w-[90vw] w-[90vw] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className='text-black! font-bold! text-xl'>Bảng Chi Phí</DialogTitle>
                </DialogHeader>
                <ExpenseTable expenses={expenses} />
            </DialogContent>
        </Dialog>
    )
}
