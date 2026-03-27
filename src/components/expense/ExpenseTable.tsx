import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Expense } from '@/api/expense'
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
} from '../ui/alert-dialog'
import type { UseMutationResult } from '@tanstack/react-query'

type Props = {
    expenses: Expense[]
    deleteMutation: UseMutationResult<unknown, Error, string, unknown>
    handleDelete: (id: string) => void
}

export function ExpenseTable({ expenses, deleteMutation, handleDelete }: Props) {
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

                                    <AlertDialogContent className='max-w-sm p-4'>
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
