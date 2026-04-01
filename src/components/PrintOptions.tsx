import type {BaseOrder} from '@/api/order'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Checkbox} from './ui/checkbox'
import {useState} from 'react'
import {Label} from './ui/label'
import {Button} from './ui/button'
import {generateKitchenReceiptHTML, generateReceiptHTML, printReceipt} from '@/lib/utils'

type Props = {
    order: BaseOrder
    open: boolean
    onClose: () => void
}
export default function PrintOptions({order, open, onClose}: Props) {
    const [isPrintReceipt, setIsPrintReceipt] = useState(true)
    const [isPrintKitchenReceipt, setIsPrintKitchenReceipt] = useState(true)

    function handlePrint() {
        if (isPrintReceipt) printReceipt(generateReceiptHTML(order), "customer")
        if (isPrintKitchenReceipt) {
            order.items.forEach((item, index) => {
                printReceipt(generateKitchenReceiptHTML(order, item, index), "kitchen")
            })
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
            <DialogContent className='min-w-[90vw] w-[90vw] h-[90vh] flex flex-col'>
                <DialogHeader>
                    <DialogTitle className='text-black! font-bold! text-xl'>In Đơn Hàng</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-start items-center gap-4 pt-5 pl-2'>
                        <Checkbox
                            id='print-confirm'
                            checked={isPrintReceipt}
                            onCheckedChange={(checked) => setIsPrintReceipt(!!checked)}
                        />
                        <Label htmlFor='print-confirm'>In cả đơn hàng</Label>
                    </div>
                    <div className='flex justify-start items-center gap-4 pt-5 pl-2'>
                        <Checkbox
                            id='print-kitchen'
                            checked={isPrintKitchenReceipt}
                            onCheckedChange={(checked) => setIsPrintKitchenReceipt(!!checked)}
                        />
                        <Label htmlFor='print-kitchen'>In theo từng sản phẩm</Label>
                    </div>
                    <Button className='h-10 w-10' onClick={handlePrint}>
                        Bắt đầu in
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
