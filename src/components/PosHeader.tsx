import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from '@/components/ui/label'
import type {Order} from "@/api/order.ts";
import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

type Props = {
    isDetail: boolean,
    isPendingOrder: boolean,
    totalPrice: number
    currentOrderNumber: number
    currentOrder: Order
    isCheckout: boolean
    setCurrentOrder: React.Dispatch<React.SetStateAction<Order>>
    handleOpenCheckout(checkout: boolean): void
    closeDisplayOrderDetail(): void
    handlePendingOrder(open: boolean): void
}

function PosHeader({
                       currentOrder,
                       isPendingOrder,
                       isDetail,
                       totalPrice,
                       isCheckout,
                       setCurrentOrder,
                       currentOrderNumber,
                       handleOpenCheckout,
                       closeDisplayOrderDetail,
                       handlePendingOrder
                   }: Props) {
    return (
        <div className='flex items-center p-2 justify-start gap-2 md:gap-4 border-b pb-2 border-[#ccc]'>
            <div className='flex items-center space-x-2 '>
                <Label htmlFor='username' className='whitespace-nowrap'>
                    Mã Đơn:
                </Label>
                <Input id='stt' className='w-15' value={currentOrderNumber} disabled/>
            </div>
            <ToggleGroup size='lg' variant='outline' type='single' value={currentOrder.type}>
                <ToggleGroupItem
                    value='takeaway'
                    onClick={() => {
                        setCurrentOrder((prev) => ({...prev, type: 'takeaway'}))
                    }}>
                    外帶
                </ToggleGroupItem>
                <ToggleGroupItem
                    value='dine_in'
                    onClick={() => {
                        setCurrentOrder((prev) => ({...prev, type: 'dine_in'}))
                    }}>
                    內用
                </ToggleGroupItem>
            </ToggleGroup>

            <div className='flex-1'></div>
            <div className='flex items-center space-x-2'>
                <Label htmlFor='username' className='whitespace-nowrap'>
                    Tổng tiền:
                </Label>
                <Input id='stt' className='w-30 md:w-40' value={totalPrice} disabled/>
            </div>
            <div className="w-45">
                {(isDetail || isCheckout || isPendingOrder) ? (
                    <Button variant='default'
                            onClick={isDetail ? closeDisplayOrderDetail : isPendingOrder ? () => handlePendingOrder(false) : () => handleOpenCheckout(false)}>
                        Đơn hàng
                    </Button>
                ) : (
                    <div className='flex gap-2'>
                        <Button className='bg-yellow-400 hover:bg-yellow-500 text-black' onClick={() => {
                            if (currentOrder.items.length === 0) {
                                toast.error("Không có sản phẩm đặt hàng")
                                return
                            }
                            handlePendingOrder(true)
                        }}>
                            Đặt hàng
                        </Button>
                        <Button className='bg-green-600 hover:bg-green-700 text-white' onClick={() => {
                            if (currentOrder.items.length === 0) {
                                toast.error("Không có sản phẩm thanh toán")
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
    );
}

export default PosHeader;