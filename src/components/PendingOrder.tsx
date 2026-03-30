import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {ICreateOrder} from "@/api/order.ts";
import React from "react";

type Props = {
    currentOrder: ICreateOrder
    setCurrentOrder: React.Dispatch<React.SetStateAction<ICreateOrder>>
    handleCreateOrder(
        status: "paid" | "pending",
    ): Promise<void>
}

function PendingOrder({currentOrder, setCurrentOrder, handleCreateOrder}: Props) {
    return (
        <div className='flex flex-col pt-2 px-4 pb-4 flex-1 gap-3'>
            <p className='text-xl'>Thông tin đặt hàng</p>
            <div className='flex items-center space-x-2 pt-6'>
                <Label htmlFor='name' className='whitespace-nowrap text-start w-24'>
                    Tên người đặt
                </Label>
                <Input id='name' className='w-50' value={currentOrder.customer?.name} onChange={(e) => {
                    setCurrentOrder((prev) => {
                        if (prev.customer) return {...prev, customer: {...prev.customer, name: e.target.value}}
                        return prev
                    })
                }}/>
            </div>
            <div className='flex items-center space-x-2 '>
                <Label htmlFor='phone' className='whitespace-nowrap text-start w-24'>
                    Số điện thoại
                </Label>
                <Input id='phone' className='w-50' value={currentOrder.customer?.phone} onChange={(e) => {
                    setCurrentOrder((prev) => {
                        if (prev.customer) return {...prev, customer: {...prev.customer, phone: e.target.value}}
                        return prev
                    })
                }}/>
            </div>
            <div className='flex justify-end ml-8'>
                <Button className='bg-yellow-400 hover:bg-yellow-500 text-black' variant='default' size='lg'
                        onClick={() => handleCreateOrder('pending')}>
                    Đặt hàng
                </Button>
            </div>
        </div>
    );
}

export default PendingOrder;