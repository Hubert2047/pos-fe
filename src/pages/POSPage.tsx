import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getItems, type Item } from '@/api/item'
import { Spinner } from '@/components/ui/spinner'
import { ButtonGroup } from '@/components/ui/button-group'
import type { OrderItem } from '@/api/order'
import { AddExpenseDialog } from '../components/expense/AddExpenseDialog'
import ExpenseTableDialog from '@/components/expense/ExpenseTableDialog'
import { useQuery } from '@tanstack/react-query'

const POSPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Phở')
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const test = true
    const [addExpense, setAddExpense] = useState<boolean>(false)
    const [openExpense, setOpenExpense] = useState<boolean>(false)
    const {
        data: items = [],
        isLoading,
    } = useQuery<Item[], Error>({
        queryKey: ['items'],
        queryFn: getItems,
        staleTime: 5 * 60 * 1000, 
    })
    const itemsByCategory = useMemo(() => {
        const grouped: Record<string, Item[]> = {}
        items.forEach((item) => {
            if (!grouped[item.categoryName]) grouped[item.categoryName] = []
            grouped[item.categoryName].push(item)
        })
        return grouped
    }, [items])

    const filteredItems = itemsByCategory[selectedCategory]
    const addItem = (item: Item) => {}
    const totalPrice = orderItems.reduce((sum, i) => sum + i.basePrice * i.quantity, 0)

    if (!test && (isLoading || !filteredItems))
        return (
            <div className='flex items-center justify-center h-screen'>
                <Spinner />
            </div>
        )

    return (
        <div className='flex h-screen p-4 gap-4'>
            <ButtonGroup>
                <Button variant='outline' onClick={() => setAddExpense(true)}>
                    Phí
                </Button>
                <Button variant='outline' onClick={() => setOpenExpense(true)}>
                    Bảng
                </Button>
            </ButtonGroup>
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
