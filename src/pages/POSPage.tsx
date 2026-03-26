import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getItems, type Item } from '@/api/item'
import { Spinner } from '@/components/ui/spinner'

interface OrderItem extends Item {
    quantity: number
}

const POSPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Phở')
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [loading, setLoading] = useState(true)
    const [itemsByCategory, setItemsByCategory] = useState<Record<string, Item[]>>({})
    useEffect(() => {
        getItems()
            .then((items) => {
               const grouped: Record<string, Item[]> = {}
               items.forEach((item) => {
                    if (!grouped[item.categoryName]) {
                        grouped[item.categoryName] = []
                    }
                    grouped[item.categoryName].push(item)
                })
                setItemsByCategory(grouped)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filteredItems = itemsByCategory[selectedCategory]
    const addItem = (item: Item) => {
        setOrderItems((prev) => {
            const exist = prev.find((i) => i._id === item._id)
            if (exist) {
                return prev.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
            } else {
                return [...prev, { ...item, quantity: 1 }]
            }
        })
    }

    const totalPrice = orderItems.reduce((sum, i) => sum + i.basePrice * i.quantity, 0)

    const handleSubmitOrder = async () => {
        if (orderItems.length === 0) return alert('Order is empty')
        try {
            alert('Order created!')
            setOrderItems([])
        } catch (err) {
            console.error(err)
            alert('Failed to create order')
        }
    }

    if (loading || !filteredItems)
        return (
            <div className='flex items-center justify-center h-screen'>
                <Spinner />
            </div>
        )

    return (
        <div className='flex h-screen p-4 gap-4'>
            <div className='flex flex-col w-60 border-r p-2 gap-2'>
                {Object.entries(itemsByCategory).map(([c]) => (
                    <Button
                        key={c}
                        variant={selectedCategory === c ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(c)}>
                        {c}
                    </Button>
                ))}
            </div>

            <div className='flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredItems.map((i) => (
                    <div
                        key={i._id}
                        className='border rounded-lg p-3 flex flex-col justify-between hover:shadow cursor-pointer'
                        onClick={() => addItem(i)}>
                        <h3 className='text-lg font-semibold'>{i.name}</h3>
                        <p className='text-gray-500'>{i.basePrice.toLocaleString()} đ</p>
                        <Button className='mt-2 w-full' onClick={() => addItem(i)}>
                            Thêm
                        </Button>
                    </div>
                ))}
            </div>

            <div className='w-80 border rounded-lg p-4 flex flex-col'>
                <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
                <div className='flex-1 overflow-y-auto'>
                    {orderItems.map((i) => (
                        <div key={i._id} className='flex justify-between items-center mb-2'>
                            <div>
                                {i.name} x{i.quantity}
                            </div>
                            <div>{(i.basePrice * i.quantity).toLocaleString()} đ</div>
                        </div>
                    ))}
                </div>
                <div className='border-t mt-2 pt-2 flex justify-between font-bold'>
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString()} đ</span>
                </div>
                <Button className='mt-4' onClick={handleSubmitOrder}>
                    Submit Order
                </Button>
            </div>
        </div>
    )
}

export default POSPage
