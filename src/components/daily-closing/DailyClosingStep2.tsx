import React, {useState} from 'react'
import {Button} from '@/components/ui/button.tsx'
import {ArrowLeft} from 'lucide-react'
import {Label} from '@/components/ui/label.tsx'
import {Input} from '@/components/ui/input.tsx'
import {Textarea} from '@/components/ui/textarea'
import NumPad from '@/components/NumPad.tsx'
import {createDailyClosing, type CashData, type ICreateDailyClosing} from '@/api/daily-closing'
import {toast} from 'sonner'
import Loading from '../Loading'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

type Props = {
    systemAmount: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
    onClose: () => void
}

function DailyClosingStep2({systemAmount, setCurrentStep, onClose}: Props) {
    const queryClient = useQueryClient()
    const [cash, setCash] = useState<CashData>({
        2000: '0',
        1000: '0',
        500: '0',
        200: '0',
        100: '0',
        50: '0',
        10: '0',
        5: '0',
        1: '0',
    })
    const [reason, setReason] = useState('')
    const [focusedDenom, setFocusedDenom] = useState<number | null>(null)
    const createDailyClosingMutation = useMutation({
        mutationFn: createDailyClosing,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['closing-of-yesterday']}).then()
        },
        onError: () => {
            toast.error('Kết toán không thành công')
        },
    })
    const actualTotal = Object.entries(cash).reduce((acc, [denom, countStr]) => {
        return acc + Number(denom) * Number(countStr || 0)
    }, 0)
    const diff = actualTotal - systemAmount

    async function handleConfirm() {
        const newDailyClosing: ICreateDailyClosing = {
            actualTotal,
            systemAmount,
            cash,
            reason,
        }
        await createDailyClosingMutation.mutateAsync(newDailyClosing)
        toast.success('Kết toán thành công')
        onClose()
    }

    return (
        <div className='flex flex-col border px-4 pb-2 rounded border-[#ccc]'>
            <div className='flex relative'>
                <Button
                    className='flex absolute -top-10 -left-4 items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white'
                    onClick={() => setCurrentStep(1)}>
                    Quay lại
                    <ArrowLeft className='w-4 h-4'/>
                </Button>
                <p className='text-center flex-1 font-bold text-xl'>Kiểm tiền</p>
            </div>
            <div className='flex justify-between gap-6 mt-4'>
                <div className='flex justify-center items-start mt-8 flex-1'>
                    <NumPad
                        currentValue={focusedDenom ? cash[focusedDenom] : "0"}
                        onChange={(val) => {
                            if (focusedDenom === null) return
                            setCash((prev) => ({
                                ...prev,
                                [focusedDenom]: String(val),
                            }))
                        }}
                    />
                </div>
                <div className='flex items-end gap-2 flex-col'>
                    {Object.keys(cash)
                        .map(Number)
                        .sort((a, b) => b - a)
                        .map((denom) => (
                            <div key={denom} className='variant flex justify-start items-center gap-4 pl-2'>
                                <Label
                                    className={`block w-12 font-semibold ${focusedDenom === denom ? 'text-blue-500' : ''}`}
                                    onClick={() => setFocusedDenom(denom)}>
                                    {denom}
                                </Label>
                                <Input
                                    type='number'
                                    value={Number(cash[denom])}
                                    onFocus={() => setFocusedDenom(denom)}
                                    onChange={(e) =>
                                        setCash((prev) => ({
                                            ...prev,
                                            [denom]: e.target.value,
                                        }))
                                    }
                                    className={`w-20 text-center ${focusedDenom === denom ? 'border-blue-500' : ''}`}
                                />
                            </div>
                        ))}
                </div>
                <div className='flex gap-2 flex-1 flex-col'>
                    <div className='variant flex justify-start items-center gap-4 pl-2'>
                        <Label className='block w-30 font-semibold'>Thực tế</Label>
                        <Input id='amount' value={actualTotal.toLocaleString()} disabled className='w-20 text-center'/>
                    </div>
                    <div className='variant flex justify-start items-center gap-4 pl-2'>
                        <Label className='block w-30 font-semibold'>Hệ thống</Label>
                        <Input
                            id='amount'
                            value={systemAmount.toLocaleString()}
                            disabled
                            className='w-20 text-center'
                        />
                    </div>
                    <div className='variant flex justify-start items-center gap-4 pl-2'>
                        <Label className='block w-30 font-semibold'>Chênh lệch</Label>
                        <Input id='amount' value={diff.toLocaleString()} disabled className='w-20 text-center'/>
                    </div>
                    <div className='variant flex justify-start items-center gap-4 pl-2'>
                        <Label className='block w-40 font-semibold'>Nguyên nhân</Label>
                        <Textarea
                            id='amount'
                            value={reason}
                            className='w-full min-h-20'
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='ml-2 w-full mt-4 bg-green-500 text-black' variant='destructive'>
                                Kết toán
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className='max-w-sm p-4'>
                            <AlertDialogHeader>
                                <AlertDialogTitle className='text-black! text-lg!'>
                                    Bạn có chắc muốn kết toán không?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Mỗi ngày chỉ được phép kết toán một lần.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirm}
                                    disabled={createDailyClosingMutation.isPending}
                                    className='bg-green-500! text-black!'>
                                    {createDailyClosingMutation.isPending ? 'Đang lưu...' : 'Kết toán'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            {createDailyClosingMutation.isPending && <Loading/>}
        </div>
    )
}

export default DailyClosingStep2
