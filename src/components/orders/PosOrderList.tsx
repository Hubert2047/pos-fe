import type { OrderItem } from '@/api/order'
import { Button } from '@/components/ui/button'

type Props = {
    items: OrderItem[]
}
export default function PosOrderList({ items }: Props) {
    return (
        <div className='flex flex-col space-y-2'>
            {items.map((item) => (
                <Button key={item.id} variant='outline' className='flex justify-between w-full'>
                    <span className='flex-1 text-left'></span>
                    <span className='w-20 text-center'>x{item.quantity}</span>
                    <span className='w-24 text-right'>
                        {item.quantity * item.basePrice +
                            item.addons.reduce((acc, i) => acc + i.amount * i.priceExtra, 0)}
                    </span>
                </Button>
            ))}
        </div>
    )
}
