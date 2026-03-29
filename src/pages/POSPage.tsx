import React, {useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {getItems, type Item} from '@/api/item'
import {getNextOrderNumber, type Order, type OrderItem} from '@/api/order.ts'
import {AddExpenseDialog} from '../components/expense/AddExpenseDialog'
import ExpenseTableDialog from '@/components/expense/ExpenseTableDialog'
import {useQuery} from '@tanstack/react-query'
import PosOrderList from '@/components/orders/PosOrderList'
import {DEFAULT_ORDER, DEFAULT_ORDER_ITEM} from "@/constance";
import PosItemSection from "@/components/PosItemSection.tsx";
import PosHeader from "@/components/PosHeader.tsx";
import Loading from "@/components/Loading.tsx";
import Checkout from "@/components/Checkout.tsx";
import {type Discount, getDiscounts} from "@/api/discount.ts";
import {OrderTable} from "@/components/orders/OrderTable.tsx";
import {FloatingButton} from "@/components/FloatingButton.tsx";
import DailyClosing from "@/components/DailyClosing.tsx";

const POSPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('牛肉河粉')
    const [currentOrder, setCurrentOrder] = useState<Order>(DEFAULT_ORDER)
    const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem>(DEFAULT_ORDER_ITEM)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [addExpense, setAddExpense] = useState<boolean>(false)
    const [openOrderTable, setOpenOrderTable] = useState<boolean>(false)
    const [openExpense, setOpenExpense] = useState<boolean>(false)
    const [isEditItem, setIsEditItem] = useState<boolean>(false)
    const [isCheckout, setIsCheckout] = useState<boolean>(false)
    const [isDetail, setIsDetail] = useState<boolean>(false)
    const [isPendingOrder, setIsPendingOrder] = useState<boolean>(false)
    const [isCheckoutPendingOrder, setIsCheckoutPendingOrder] = useState<boolean>(false)
    const [openBtns, setOpenBtns] = useState(true)
    const [openDailyClosing, setOpenDailyClosing] = useState(false)
    const {data: items = [], isLoading: isItemsLoading} = useQuery<Item[], Error>({
        queryKey: ['items'],
        queryFn: () => getItems(true),
        staleTime: 5 * 60 * 1000,
    })
    const {data: discounts = []} = useQuery<Discount[], Error>({
        queryKey: ['discounts'],
        queryFn: getDiscounts,
        staleTime: 5 * 60 * 1000,
    })
    const {data: nextOrderNumber, isLoading: isOrderNumberLoading} = useQuery<number, Error>({
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

    const filteredItems = itemsByCategory[selectedCategory] ?? []

    const selectUpdateOrderItem = (orderItem: OrderItem) => {
        setCurrentOrderItem(orderItem)
        const item = items.find((item) => orderItem.id === item._id)
        if (item) setSelectedItem(item)
        setIsEditItem(true)
    }

    const totalPrice = useMemo(() => {
        const total = currentOrder.items.reduce((sum, i) => {
            const item = i.basePrice * i.quantity
            const addon = i.addons.reduce((sum, a) => sum + a.amount * a.priceExtra, 0)
            return sum + item + addon
        }, 0)
        if (!currentOrder.discount) return total;
        if (currentOrder.discount.type === "percent") {
            const percent = currentOrder.discount.amount / 100;
            return total * (1 - percent);
        }
        return total - currentOrder.discount.amount
    }, [currentOrder.discount, currentOrder.items])

    function handleOpenCheckout(checkout: boolean) {
        if (isCheckoutPendingOrder) {
            setIsCheckoutPendingOrder(false)
            setCurrentOrder(DEFAULT_ORDER)
        }
        setIsCheckout(checkout)
        setSelectedItem(null)
        setCurrentOrderItem(DEFAULT_ORDER_ITEM)
    }

    function handlePendingOrder(open: boolean) {
        setCurrentOrder((prev) => ({...prev, customer: open ? {name: "", phone: ""} : null}))
        setSelectedItem(null)
        setCurrentOrderItem(DEFAULT_ORDER_ITEM)
        setIsPendingOrder(open)
    }

    function displayOrderDetail(order: Order) {
        setCurrentOrder(order)
        setCurrentOrderItem(order.items[0])
        const item = items.find((item) => order.items[0].id === item._id)
        if (item) setSelectedItem(item)
        setOpenOrderTable(false)
        setIsDetail(true)
        setIsCheckout(false)
    }

    function closeDisplayOrderDetail() {
        setIsDetail(false)
        setIsEditItem(false)
        setCurrentOrderItem(DEFAULT_ORDER_ITEM)
        setCurrentOrder(DEFAULT_ORDER)
        setSelectedItem(null)
    }

    function checkoutPendingOrder(order: Order) {
        setCurrentOrder(order)
        setSelectedItem(null)
        setOpenOrderTable(false)
        setIsCheckout(true)
        setIsCheckoutPendingOrder(true)
    }

    if (isItemsLoading || isOrderNumberLoading)
        return <Loading/>

    return (
        <div className='flex h-screen gap-2 p-2 overflow-hidden'>
            <FloatingButton open={openBtns} setOpenBtns={setOpenBtns}/>
            <div className='left flex flex-col flex-1 min-w-0 border border-[#ccc] rounded'>
                <PosHeader items={items} isDetail={isDetail} isPendingOrder={isPendingOrder} currentOrder={currentOrder}
                           setCurrentOrder={setCurrentOrder}
                           handleOpenCheckout={handleOpenCheckout}
                           handlePendingOrder={handlePendingOrder}
                           isCheckout={isCheckout}
                           currentOrderNumber={currentOrderNumber} totalPrice={totalPrice}
                           closeDisplayOrderDetail={closeDisplayOrderDetail}/>
                <div className='flex gap-2 p-2 h-full min-h-0'>
                    <div className='ordered-items rounded p-4 border flex-1 max-w-80 border-[#ccc]'>
                        <PosOrderList items={currentOrder.items}
                                      updateItem={selectUpdateOrderItem}
                                      currentOrderItem={currentOrderItem}/>
                    </div>
                    {(isCheckout || isPendingOrder) ? <Checkout totalPrice={totalPrice} isPendingOrder={isPendingOrder}
                                                                currentOrderNumber={currentOrderNumber}
                                                                setCurrentOrder={setCurrentOrder}
                                                                currentOrder={currentOrder}
                                                                isCheckoutPendingOrder={isCheckoutPendingOrder}
                                                                setIsCheckoutPendingOrder={setIsCheckoutPendingOrder}
                                                                discounts={discounts}
                                                                handlePendingOrder={handlePendingOrder}
                                                                handleOpenCheckout={handleOpenCheckout}
                                                                setCurrentOrderNumber={setCurrentOrderNumber}/> :
                        <PosItemSection isDetail={isDetail} currentOrderNumber={currentOrderNumber}
                                        itemsByCategory={itemsByCategory}
                                        currentOrder={currentOrder}
                                        selectedCategory={selectedCategory}
                                        selectedItem={selectedItem} filteredItems={filteredItems}
                                        currentOrderItem={currentOrderItem}
                                        isEditItem={isEditItem}
                                        setCurrentOrderItem={setCurrentOrderItem} setCurrentOrder={setCurrentOrder}
                                        setSelectedCategory={setSelectedCategory} setSelectedItem={setSelectedItem}
                                        setIsEditItem={setIsEditItem}/>}

                </div>
            </div>
            {openBtns && <div className='right flex flex-col justify-end p-2 gap-2 border border-[#ccc] rounded'>
                <Button variant='outline' onClick={() => setOpenOrderTable(true)}>
                    Bảng đơn hàng
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    Thu ngân
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    Thêm chi phí
                </Button>
                <Button variant='outline' onClick={() => setOpenExpense(true)}>
                    Bảng chi phí
                </Button>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    Chấm công
                </Button>
                <Button variant='outline' onClick={() => setOpenDailyClosing(true)}>
                    Kết sổ
                </Button>
            </div>}
            <AddExpenseDialog open={addExpense} onClose={() => setAddExpense(false)}/>
            {openExpense && <ExpenseTableDialog
                open={openExpense}
                onClose={() => {
                    setOpenExpense(false)
                }}
            />}
            {openOrderTable &&
                <OrderTable open={openOrderTable} displayOrderDetail={displayOrderDetail}
                            checkoutPendingOrder={checkoutPendingOrder} onClose={() => {
                    setOpenOrderTable(false)
                }}/>}
            {openDailyClosing && <DailyClosing open={openDailyClosing} onClose={() => setOpenDailyClosing(false)}/>}
        </div>
    )
}

export default POSPage
