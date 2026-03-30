import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { useState } from 'react'
import DailyClosingStep1 from '@/components/daily-closing/DailyClosingStep1.tsx'
import DailyClosingStep2 from '@/components/daily-closing/DailyClosingStep2.tsx'
import { getSalesByPayment, type SalesByPayment } from '@/api/order.ts'
import { useQuery } from '@tanstack/react-query'
import { type Expense, getExpenses } from '@/api/expense.ts'
import type { PaymentMethod } from '@/constance'
import { getRevenues, type Revenue } from '@/api/other-revenue'
import { getClosingOfYesterday } from '@/api/daily-closing'
type Props = {
    open: boolean
    onClose: () => void
}

function DailyClosing({ open, onClose }: Props) {
    const [currentStep, setCurrentStep] = useState(1)
    const { data: salesData = {} as Record<PaymentMethod, SalesByPayment>, isLoading: isSalesLoading } = useQuery<
        Record<PaymentMethod, SalesByPayment>,
        Error
    >({
        queryKey: ['sale-by-payment'],
        queryFn: getSalesByPayment,
        staleTime: 5 * 60 * 1000,
    })
    const { data: expenses = [], isLoading: isExpenseLoading } = useQuery<Expense[], Error>({
        queryKey: ['expenses'],
        queryFn: () => getExpenses(),
        staleTime: 5 * 60 * 1000,
    })
    const { data: otherRevenues = [] } = useQuery<Revenue[], Error>({
        queryKey: ['revenues'],
        queryFn: () => getRevenues(),
        staleTime: 5 * 60 * 1000,
    })
     const { data: closingOfYesterday = { amount: 0 } } = useQuery<{ amount: number }, Error>({
        queryKey: ['closing-of-yesterday'],
        queryFn: () => getClosingOfYesterday(),
        staleTime: 5 * 60 * 1000,
    })
    const totalCashSales = salesData['cash']?.totalSales || 0
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0)
    const totalOtherRevenues = otherRevenues.reduce((sum, revenue) => sum + revenue.price, 0)
    const systemAmount = closingOfYesterday.amount + totalCashSales + totalOtherRevenues - totalExpenses
    
    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    if (!isOpen) onClose()
                }}>
                <DialogContent className='min-w-[95vw] w-[95vw] h-[90vh] flex flex-col'>
                    <DialogHeader>
                        <DialogTitle className='text-black! font-bold! text-xl text-center'>
                            Kết Toán Hàng Ngày
                        </DialogTitle>
                    </DialogHeader>
                    {currentStep === 1 && (
                        <DailyClosingStep1
                            expenses={expenses}
                            salesData={salesData}
                            isExpenseLoading={isExpenseLoading}
                            isSalesLoading={isSalesLoading}
                            setCurrentStep={setCurrentStep}
                        />
                    )}
                    {currentStep === 2 && <DailyClosingStep2 systemAmount={systemAmount} setCurrentStep={setCurrentStep} />}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DailyClosing
