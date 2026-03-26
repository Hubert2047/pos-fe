import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteExpense, getExpenses, type Expense } from '@/api/expense'
import { Spinner } from '../ui/spinner'
import { toast } from 'sonner'

export function ExpenseTable() {
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
        <Table >
            <TableHeader>
                <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Chú thích</TableHead>
                    <TableHead>Hành động</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {expenses.map((exp) => {
                    const isDeleting = deleteMutation.isPending && deleteMutation.variables === exp._id
                    return (
                        <TableRow key={exp._id}>
                            <TableCell>{exp.name}</TableCell>
                            <TableCell>{exp.price.toLocaleString()} ₫</TableCell>
                            <TableCell>{exp.note}</TableCell>

                            <TableCell>
                                <Button variant='default'>Sửa</Button>

                                {/* Confirm Delete */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className='ml-2' variant='destructive' disabled={isDeleting}>
                                            Xóa
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent className="max-w-sm p-4">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className='text-black!'>
                                                Bạn có chắc muốn xóa?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Hành động này không thể hoàn tác.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Huỷ</AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={() => handleDelete(exp._id)}
                                                disabled={isDeleting}
                                                className='bg-red-600 hover:bg-red-700'>
                                                {isDeleting ? 'Đang xoá...' : 'Xóa'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
