import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Field, FieldGroup} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {useState} from 'react'
import {toast} from 'sonner'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {createRevenue} from "@/api/other-revenue.ts";
import {Button} from "@/components/ui/button.tsx";

type Props = {
    open: boolean
    onClose: () => void
}

export function AddOtherRevenue({open, onClose}: Props) {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        note: '',
    })
    const createRevenueMutation = useMutation({
        mutationFn: createRevenue,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['revenues']}).then()
            toast.success('Lưu thành công', {
                closeButton: true,
                duration: 1500,
            })
            onClose()
            setFormData({name: '', price: '', note: ''})
        },
        onError: () => {
            toast.error('Lưu thất bại')
        },
    })

    const handleChangeRevenue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData.name) {
            toast.warning('Tên không được bỏ trống')
            return
        }

        if (!formData.price) {
            toast.warning('Giá không được bỏ trống')
            return
        }

        createRevenueMutation.mutate({
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
                        <DialogTitle className='text-black! font-bold! text-xl'>Thêm thu nhập khác</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor='name-1'>Tên</Label>
                            <Input id='name-1' name='name' value={formData.name} onChange={handleChangeRevenue}/>
                        </Field>

                        <Field>
                            <Label htmlFor='price-1'>Giá</Label>
                            <Input
                                id='price-1'
                                name='price'
                                type='number'
                                value={formData.price}
                                onChange={handleChangeRevenue}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor='note-1'>Chú thích</Label>
                            <Input id='note-1' name='note' value={formData.note} onChange={handleChangeRevenue}/>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className='mt-4'>
                        <DialogClose asChild>
                            <Button variant='outline'>Huỷ</Button>
                        </DialogClose>

                        <Button type='submit' disabled={createRevenueMutation.isPending}>
                            {createRevenueMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
