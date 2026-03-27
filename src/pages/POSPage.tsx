import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getItems, type Item } from '@/api/item'
import { Spinner } from '@/components/ui/spinner'
import { getNextOrderNumber, type Order, type OrderItem } from '@/api/order'
import { AddExpenseDialog } from '../components/expense/AddExpenseDialog'
import ExpenseTableDialog from '@/components/expense/ExpenseTableDialog'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { toggleArray } from '@/lib/utils'
import PosOrderList from '@/components/orders/PosOrderList'
import { Badge } from '@/components/ui/badge'
const defaultOrderItem: OrderItem = {
    id: '',
    name: '',
    quantity: 1,
    basePrice: 0,
    variant: '',
    addons: [],
    noteOptions: [],
    note: '',
}
const defaultOrder: Order = {
    number: 1,
    items: [],
    totalPrice: 0,
    status: 'pending',
    paymentMethod: 'cash',
    discount: null,
    type: 'takeaway',
}
const POSPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('牛肉河粉')
    const [currentOrder, setCurrentOrder] = useState<Order>(defaultOrder)
    const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem>(defaultOrderItem)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [addExpense, setAddExpense] = useState<boolean>(false)
    const [openExpense, setOpenExpense] = useState<boolean>(false)
    const { data: items = [], isLoading: isItemsLoading } = useQuery<Item[], Error>({
        queryKey: ['items'],
        queryFn: () => getItems(true),
        staleTime: 5 * 60 * 1000,
    })
    const { data: nextOrderNumber, isLoading: isOrderNumberLoading } = useQuery<number, Error>({
        queryKey: ['next-order-number'],
        queryFn: getNextOrderNumber,
        staleTime: Infinity,
    })
    const [currentOrderNumber, setCurrentOrderNumber] = useState<number>(nextOrderNumber ?? 1)
    const itemsByCategory = useMemo(() => {
        const grouped: Record<string, Item[]> = {}
        items.forEach((item) => {
            if (!grouped[item.categoryName]) grouped[item.categoryName] = []
            grouped[item.categoryName].push(item)
        })
        return grouped
    }, [items])

    const filteredItems = itemsByCategory[selectedCategory]
    const selectItem = (item: Item) => {
        let variant = ''
        if (item.variants.length > 0) {
            variant = item.variants[0]
        }
        setCurrentOrderItem((prev) => ({
            ...prev,
            id: item._id,
            number: currentOrderNumber,
            name: item.name,
            variant,
            basePrice: item.basePrice,
        }))
        setSelectedItem(item)
    }
    const addItem = () => {
        setCurrentOrder((prev) => ({ ...prev, items: [...prev.items, currentOrderItem] }))
        setCurrentOrderItem(defaultOrderItem)
        setSelectedItem(null)
    }
    const cancelAddItem = () => {
        setCurrentOrderItem(defaultOrderItem)
        setSelectedItem(null)
    }

    const totalPrice = currentOrder.items.reduce((sum, i) => {
        const item = i.basePrice * i.quantity
        const addon = i.addons.reduce((sum, a) => sum + a.amount * a.priceExtra, 0)
        return sum + item + addon
    }, 0)

    if (isItemsLoading || !filteredItems || isOrderNumberLoading)
        return (
            <div className='flex items-center justify-center h-screen'>
                <Spinner />
            </div>
        )

    return (
        <div className='flex h-screen gap-2 p-2'>
            <div className='left flex flex-col flex-1 border border-[#ccc] rounded'>
                <div className='flex items-center p-2 justify-start gap-2 md:gap-4 border-b pb-2 border-[#ccc]'>
                    <div className='flex items-center space-x-2 '>
                        <Label htmlFor='username' className='whitespace-nowrap'>
                            STT:
                        </Label>
                        <Input id='stt' className='w-15' value={currentOrderNumber} disabled />
                    </div>
                    <ToggleGroup size='lg' variant='outline' type='single' defaultValue={currentOrder.type}>
                        <ToggleGroupItem
                            value='takeaway'
                            onClick={() => {
                                setCurrentOrder((prev) => ({ ...prev, type: 'takeaway' }))
                            }}>
                            a
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value='dine_in'
                            onClick={() => {
                                setCurrentOrder((prev) => ({ ...prev, type: 'dine_in' }))
                            }}>
                            b
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <div className='flex-1'></div>
                    <div className='flex items-center space-x-2'>
                        <Label htmlFor='username' className='whitespace-nowrap'>
                            Tổng tiền:
                        </Label>
                        <Input id='stt' className='w-30 md:w-40' value={totalPrice} disabled />
                    </div>
                    <Button variant='default'>Thanh toán</Button>
                </div>
                <div className='flex gap-2 p-2 h-full'>
                    <div className='ordered-items rounded p-1 border w-50 border-[#ccc] h-full'>
                        <PosOrderList items={currentOrder.items} />
                    </div>
                    <div className='categories flex flex-col gap-2 rounded border p-1 border-[#ccc]'>
                        {Object.keys(itemsByCategory).map((categoryName) => {
                            return (
                                <Button
                                    key={categoryName}
                                    variant={categoryName === selectedCategory ? 'default' : 'outline'}
                                    onClick={() => {
                                        if (selectedItem) return
                                        setSelectedCategory(categoryName)
                                    }}></Button>
                            )
                        })}
                    </div>
                    <div className='select-items rounded border border-[#ccc] flex-1 p-2 md:p-4 h-full'>
                        {selectedItem === null ? (
                            filteredItems.map((item) => {
                                return (
                                    <Button key={item._id} variant={'default'} onClick={() => selectItem(item)}>
                                        {'a'}
                                    </Button>
                                )
                            })
                        ) : (
                            <div className='flex flex-col justify-start gap-6'>
                                <p className='text-2xl'>a</p>
                                {/* variants */}
                                {selectedItem.variants.length > 0 && (
                                    <div className='variant flex justify-start items-center gap-4'>
                                        <Label className='block font-semibold'>Loại:</Label>
                                        <RadioGroup
                                            value={currentOrderItem.variant}
                                            onValueChange={(value) =>
                                                setCurrentOrderItem((prev) => ({ ...prev, variant: value }))
                                            }
                                            className='flex gap-3'>
                                            {selectedItem.variants?.map((variant) => (
                                                <div key={variant} className='flex items-center space-x-2'>
                                                    <RadioGroupItem value={variant} id={variant} />
                                                    <Label htmlFor={variant}>b</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                )}
                                {/* note options */}
                                {selectedItem.noteOptions.length > 0 && (
                                    <div className='note-options flex justify-start items-center gap-4'>
                                        <Label className='block font-semibold'>Không thêm: </Label>
                                        <ToggleGroup size='lg' variant='outline' type='multiple'>
                                            {selectedItem.noteOptions.map((note) => {
                                                return (
                                                    <ToggleGroupItem
                                                        key={note}
                                                        value={note}
                                                        onClick={() => {
                                                            setCurrentOrderItem((prev) => ({
                                                                ...prev,
                                                                noteOptions: toggleArray(prev.noteOptions, note),
                                                            }))
                                                        }}>
                                                        A
                                                    </ToggleGroupItem>
                                                )
                                            })}
                                        </ToggleGroup>
                                    </div>
                                )}
                                {/* add-on */}
                                {selectedItem.addons.length > 0 && (
                                    <div className='add-on flex justify-start items-center pt-4 gap-4'>
                                        <Label className='block font-semibold'>Thêm: </Label>
                                        <ToggleGroup size='lg' variant='outline' type='multiple'>
                                            {selectedItem.addons.map((addon) => {
                                                return (
                                                    <ToggleGroupItem
                                                        key={addon._id}
                                                        value={addon._id}
                                                        className='relative flex flex-col items-center justify-center p-2'
                                                        onClick={() => {
                                                            setCurrentOrderItem((prev) => ({
                                                                ...prev,
                                                                addons: toggleArray(
                                                                    prev.addons,
                                                                    { ...addon, amount: 1, id: addon._id },
                                                                    'id',
                                                                ),
                                                            }))
                                                        }}>
                                                        <span className='text-center'>a</span>
                                                        <Badge className='absolute -top-6'>{addon.priceExtra}</Badge>
                                                    </ToggleGroupItem>
                                                )
                                            })}
                                        </ToggleGroup>
                                    </div>
                                )}
                                <div className='note flex justify-start items-center gap-4'>
                                    <Label className='w-20 block font-semibold text-start'>Ghi chú: </Label>
                                    <Input
                                        id='note'
                                        value={currentOrderItem.note}
                                        onChange={(e) => {
                                            setCurrentOrderItem((prev) => ({ ...prev, note: e.target.value }))
                                        }}
                                    />
                                </div>
                                <div className='flex justify-end pt-4 gap-3'>
                                    <Button variant='default' size='lg' onClick={addItem}>
                                        Thêm Món
                                    </Button>
                                    <Button variant='outline' size='lg' onClick={cancelAddItem}>
                                        Huỷ
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='right flex flex-col justify-end p-2 gap-2 border border-[#ccc] rounded'>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    Thêm Phí
                </Button>
                <Button variant='outline' onClick={() => setOpenExpense(true)}>
                    Bảng Phí
                </Button>
            </div>
            <AddExpenseDialog open={addExpense} onClose={() => setAddExpense(false)} />
            <ExpenseTableDialog
                open={openExpense}
                onClose={() => {
                    setOpenExpense(false)
                }}
            />
        </div>
    )
}

export default POSPage
