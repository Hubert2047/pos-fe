import { createExpense } from '@/api/expense'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Props = {
    open: boolean
    onClose: () => void
}

export function AddExpenseDialog({ open, onClose }: Props) {
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        note: '',
    })

    const createMutation = useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast('Lưu thành công', {
                closeButton: true,
                duration: 1500,
            })
            onClose()
            setFormData({ name: '', price: '', note: '' })
        },
        onError: () => {
            toast('Lưu thất bại')
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData.name) {
            toast('Tên không được bỏ trống')
            return
        }

        if (!formData.price) {
            toast('Giá không được bỏ trống')
            return
        }

        createMutation.mutate({
            ...formData,
            price: Number(formData.price),
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
            <DialogContent className='sm:max-w-sm'>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className='text-black! font-bold! text-xl'>Thêm Chi Phí</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor='name-1'>Tên</Label>
                            <Input id='name-1' name='name' value={formData.name} onChange={handleChange} />
                        </Field>

                        <Field>
                            <Label htmlFor='price-1'>Giá</Label>
                            <Input
                                id='price-1'
                                name='price'
                                type='number'
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor='note-1'>Chú thích</Label>
                            <Input id='note-1' name='note' value={formData.note} onChange={handleChange} />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className='mt-4'>
                        <DialogClose asChild>
                            <Button variant='outline'>Huỷ</Button>
                        </DialogClose>

                        <Button type='submit' disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
