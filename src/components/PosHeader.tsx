import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label'
import React, {useState} from 'react'
import { Button } from '@/components/ui/button.tsx'
import { toast } from 'sonner'
import { getPaymentMethodByType, getPriceByType } from '@/lib/utils.ts'
import type { Item } from '@/api/item.ts'
import type { BaseOrder } from '@/api/order'

type Props = {
    items: Item[]
    isDetail: boolean
    isPendingOrder: boolean
    totalPrice: number
    currentOrderNumber: number
    currentOrder: BaseOrder
    isCheckout: boolean
    setCurrentOrder: React.Dispatch<React.SetStateAction<BaseOrder>>
    handleOpenCheckout(checkout: boolean): void
    closeDisplayOrderDetail(): void
    handlePendingOrder(open: boolean): void
}

function PosHeader({
    currentOrder,
    items,
    isPendingOrder,
    isDetail,
    totalPrice,
    isCheckout,
    setCurrentOrder,
    currentOrderNumber,
    handleOpenCheckout,
    closeDisplayOrderDetail,
    handlePendingOrder,
}: Props) {
    const [test,setTest] = useState("")
    console.log(totalPrice)
    const handlePrint = () => {

        const invoiceContent = test
        const iframe = document.createElement('iframe')

        Object.assign(iframe.style, {
            position: 'fixed',
            right: '0',
            bottom: '0',
            width: '0',
            height: '0',
            border: '0',
            visibility: 'hidden',
        })

        const htmlContent = `
      <html>
        <head>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
                font-family: 'Courier New', Courier, monospace; 
                width: 72mm; 
                margin: 0; 
                padding: 10px 2mm;
                background: white;
            }
            pre { 
                white-space: pre-wrap; 
                word-wrap: break-word;
                font-size: 13px; 
                line-height: 1.5;
                font-weight: bold;
                margin: 0;
            }
          </style>
        </head>
        <body>
          <pre>${invoiceContent}</pre>
          <script>
            window.onload = function() {
                window.focus();
                window.print();
            };
          </script>
        </body>
      </html>
    `

        iframe.srcdoc = htmlContent

        document.body.appendChild(iframe)

        const frameWindow = iframe.contentWindow
        if (frameWindow) {
            frameWindow.onafterprint = () => {
                document.body.removeChild(iframe)
            }
        }
    }

    return (
        <div className='flex items-center p-2 justify-start gap-2 border-b pb-2 border-[#ccc]'>
            <div className='flex items-center space-x-2 '>
                <Label htmlFor='stt' className='whitespace-nowrap'>
                    Mã Đơn:
                </Label>
                <Input id='stt' className='w-15' value={currentOrderNumber} disabled />
            </div>

            <ToggleGroup
                size='lg'
                variant='outline'
                type='single'
                value={currentOrder.type}
                onValueChange={(value) => {
                    if (value)
                        setCurrentOrder((prev) => ({
                            ...prev,
                            type: value as 'dine_in' | 'takeaway' | 'uber' | 'foodpanda',
                            paymentMethod: getPaymentMethodByType(
                                value as 'dine_in' | 'takeaway' | 'uber' | 'foodpanda',
                            ),
                            items: prev.items.map((item) => {
                                const originItem = items.find((i) => i._id === item.id)
                                if (originItem)
                                    return {
                                        ...item,
                                        basePrice: getPriceByType(
                                            value as 'dine_in' | 'takeaway' | 'uber' | 'foodpanda',
                                            originItem.price,
                                        ),
                                    }
                                return item
                            }),
                        }))
                }}>
                <ToggleGroupItem value='takeaway'>外帶</ToggleGroupItem>
                <ToggleGroupItem value='dine_in'>內用</ToggleGroupItem>
                <ToggleGroupItem value='uber'>Uber</ToggleGroupItem>
                <ToggleGroupItem value='foodpanda'>FoodPanda</ToggleGroupItem>
            </ToggleGroup>
            <div className='flex items-center space-x-2 '>
                <Label htmlFor='stt' className='whitespace-nowrap'>
                    test:
                </Label>
                <Input id='stt' className='flex-1' value={test} onChange={(e)=>{setTest(e.target.value)}} />
            </div>
            <div className='flex-1'></div>

            {/*<div className='flex items-center space-x-2'>*/}
            {/*    <Label className='whitespace-nowrap'>Tổng tiền:</Label>*/}
            {/*    <Input className='w-30 font-bold text-red-600' value={totalPrice.toLocaleString()} disabled />*/}
            {/*</div>*/}

            {/* Nút In được đặt ở đây */}
            <Button variant='outline' className='border-blue-500 text-blue-500 hover:bg-blue-50' onClick={handlePrint}>
                In
            </Button>

            <div className='w-48'>
                {isDetail || isCheckout || isPendingOrder ? (
                    <Button
                        className='w-full'
                        variant='default'
                        onClick={
                            isDetail
                                ? closeDisplayOrderDetail
                                : isPendingOrder
                                  ? () => handlePendingOrder(false)
                                  : () => handleOpenCheckout(false)
                        }>
                        Đơn hàng
                    </Button>
                ) : (
                    <div className='flex gap-2'>
                        <Button
                            className='bg-yellow-400 hover:bg-yellow-500 text-black'
                            onClick={() => {
                                if (currentOrder.items.length === 0) {
                                    toast.error('Không có sản phẩm đặt hàng')
                                    return
                                }
                                handlePendingOrder(true)
                            }}>
                            Đặt hàng
                        </Button>
                        <Button
                            className='bg-green-600 hover:bg-green-700 text-white'
                            onClick={() => {
                                if (currentOrder.items.length === 0) {
                                    toast.error('Không có sản phẩm thanh toán')
                                    return
                                }
                                handleOpenCheckout(true)
                            }}>
                            Thanh toán
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PosHeader
