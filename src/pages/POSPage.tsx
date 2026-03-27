import React, {useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {getItems, type Item} from '@/api/item'
import {Spinner} from '@/components/ui/spinner'
import {getNextOrderNumber, type Order, type OrderItem} from '@/api/order'
import {AddExpenseDialog} from '../components/expense/AddExpenseDialog'
import ExpenseTableDialog from '@/components/expense/ExpenseTableDialog'
import {useQuery} from '@tanstack/react-query'
import {Input} from '@/components/ui/input'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Label} from '@/components/ui/label'
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'
import {toggleArray} from '@/lib/utils'
import PosOrderList from '@/components/orders/PosOrderList'
import {Badge} from '@/components/ui/badge'
import NumPad from "@/components/NumPad.tsx";

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
    const [isEditItem, setIsEditItem] = useState<boolean>(false)
    const {data: items = [], isLoading: isItemsLoading} = useQuery<Item[], Error>({
        queryKey: ['items'],
        queryFn: () => getItems(true),
        staleTime: 5 * 60 * 1000,
    })
    const {data: nextOrderNumber, isLoading: isOrderNumberLoading} = useQuery<number, Error>({
        queryKey: ['next-order-number'],
        queryFn: getNextOrderNumber,
        staleTime: Infinity,
    })
    const [currentOrderNumber, _] = useState<number>(nextOrderNumber ?? 1)
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
    const selectUpdateOrderItem = (orderItem: OrderItem) => {
        setCurrentOrderItem(orderItem)
        const item = items.find((item) => orderItem.id === item._id)
        if (item) setSelectedItem(item)
        setIsEditItem(true)
    }
    const addItem = () => {
        setCurrentOrder((prev) => ({...prev, items: [...prev.items, currentOrderItem]}))
        setCurrentOrderItem(defaultOrderItem)
        setSelectedItem(null)
    }
    const updateItem = () => {
        setCurrentOrder((prev) => {
            const items = prev.items.map((i) => {
                if (i.id === currentOrderItem.id) return currentOrderItem
                return i
            })
            return {...prev, items}
        })
        setCurrentOrderItem(defaultOrderItem)
        setSelectedItem(null)
        setIsEditItem(false)
    }
    const deleteItem = () => {
        setCurrentOrder((prev) => {
            const items = prev.items.filter((i) => {
                return i.id !== currentOrderItem.id;
            })
            return {...prev, items}
        })
        setCurrentOrderItem(defaultOrderItem)
        setSelectedItem(null)
        setIsEditItem(false)
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
                <Spinner/>
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
                        <Input id='stt' className='w-15' value={currentOrderNumber} disabled/>
                    </div>
                    <ToggleGroup size='lg' variant='outline' type='single' defaultValue={currentOrder.type}>
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
                    <Button variant='default'>Thanh toán</Button>
                </div>
                <div className='flex gap-2 p-2 h-full min-h-0'>
                    <div className='ordered-items rounded p-4 border md:min-w-85 border-[#ccc]'>
                        <PosOrderList items={currentOrder.items} updateItem={selectUpdateOrderItem}
                                      currentOrderItem={currentOrderItem}/>
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
                                    }}>{categoryName}</Button>
                            )
                        })}
                    </div>
                    <div
                        className='select-items flex flex-wrap rounded border border-[#ccc] flex-1 p-2 h-full gap-2'>
                        {selectedItem === null ? (
                            filteredItems.map((item) => {
                                return (
                                    <Button key={item._id} variant={'default'} onClick={() => selectItem(item)}>
                                        {item.name}
                                    </Button>
                                )
                            })
                        ) : (
                            <div className='flex flex-col flex-1 justify-start gap-3'>
                                <p className='text-xl'>{currentOrderItem.name}</p>
                                <div className='variant flex justify-start items-center gap-4'>
                                    <Label className='block w-9 font-semibold'>數量:</Label>
                                    <Input id='amount' value={currentOrderItem.quantity}
                                           onChange={(e) => {
                                               setCurrentOrderItem((prev) => ({
                                                   ...prev,
                                                   quantity: Number(e.target.value)
                                               }))
                                           }}/>
                                </div>
                                {/* variants */}
                                {selectedItem.variants.length > 0 && (
                                    <div className='variant flex justify-start items-center gap-4'>
                                        <Label className='block w-9 font-semibold'>粉類:</Label>
                                        <RadioGroup
                                            value={currentOrderItem.variant}
                                            onValueChange={(value) =>
                                                setCurrentOrderItem((prev) => ({...prev, variant: value}))
                                            }
                                            className='flex gap-4'>
                                            {selectedItem.variants?.map((variant) => (
                                                <div key={variant} className='flex items-center space-x-2'>
                                                    <RadioGroupItem value={variant} id={variant}/>
                                                    <Label htmlFor={variant}>{variant}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                )}
                                {/* note options */}
                                {selectedItem.noteOptions.length > 0 && (
                                    <div className='note-options flex justify-start items-center gap-4'>
                                        <Label className='block font-semibold'>不要: </Label>
                                        <ToggleGroup size='lg' variant='outline' type='multiple'
                                                     value={currentOrderItem.noteOptions}>
                                            {selectedItem.noteOptions.map((note) => {
                                                return (
                                                    <ToggleGroupItem
                                                        key={note}
                                                        className='md:w-15'
                                                        value={note}
                                                        onClick={() => {
                                                            setCurrentOrderItem((prev) => ({
                                                                ...prev,
                                                                noteOptions: toggleArray(prev.noteOptions, note),
                                                            }))
                                                        }}>
                                                        {note}
                                                    </ToggleGroupItem>
                                                )
                                            })}
                                        </ToggleGroup>
                                    </div>
                                )}
                                {/* add-on */}
                                {selectedItem.addons.length > 0 && (
                                    <div className='add-on flex justify-start items-center mt-6 gap-4'>
                                        <Label className='block font-semibold'>加料: </Label>
                                        <ToggleGroup size='lg' variant='outline' type='multiple'
                                                     value={currentOrderItem.addons.map(a => a.name)}>
                                            {selectedItem.addons.map((addon) => {
                                                return (
                                                    <ToggleGroupItem
                                                        key={addon._id}
                                                        value={addon.name}
                                                        className='relative flex md:w-15 flex-col items-center justify-center p-2'
                                                        onClick={() => {
                                                            setCurrentOrderItem((prev) => ({
                                                                ...prev,
                                                                addons: toggleArray(
                                                                    prev.addons,
                                                                    {...addon, amount: 1, id: addon._id},
                                                                    'id',
                                                                ),
                                                            }))
                                                        }}>
                                                        <span className='text-center'>{addon.name}</span>
                                                        <Badge className='absolute -top-6'>{addon.priceExtra}</Badge>
                                                    </ToggleGroupItem>
                                                )
                                            })}
                                        </ToggleGroup>
                                    </div>
                                )}
                                <div className='note flex justify-start items-center gap-4'>
                                    <Label className='w-9 block font-semibold text-start'>備注: </Label>
                                    <Input
                                        id='note'
                                        value={currentOrderItem.note}
                                        onChange={(e) => {
                                            setCurrentOrderItem((prev) => ({...prev, note: e.target.value}))
                                        }}
                                    />
                                </div>
                                <div className='flex justify-start pt-2 gap-3'>
                                    <NumPad onChange={(num) => {
                                        let value = currentOrderItem.quantity;
                                        if (num === "clear") {
                                            value = Math.floor(value / 10);
                                        } else {
                                            if (value === 0) {
                                                value = Number(num);
                                            } else {
                                                value = Number(`${value}${num}`);
                                            }
                                        }
                                        setCurrentOrderItem((prev) => ({...prev, quantity: value}));
                                    }}/>
                                    <div className="flex-1"></div>
                                    <>
                                        {isEditItem ? <>
                                            <Button variant='default' size='lg' onClick={updateItem}>
                                                修改
                                            </Button>
                                            <Button variant='destructive' size='lg' onClick={deleteItem}>
                                                刪除
                                            </Button>
                                        </> : <Button variant='default' size='lg' onClick={addItem}>
                                            新增
                                        </Button>}
                                        <Button variant='outline' size='lg' onClick={cancelAddItem}>
                                            取消
                                        </Button>
                                    </>

                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='right flex flex-col justify-end p-2 gap-2 border border-[#ccc] rounded'>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    訂單
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    錢櫃管理
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    新增費用
                </Button>
                <Button variant='outline' onClick={() => setOpenExpense(true)}>
                    費用表單
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    打卡
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    日結
                </Button>
            </div>
            <AddExpenseDialog open={addExpense} onClose={() => setAddExpense(false)}/>
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
