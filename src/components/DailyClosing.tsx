import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {useState} from "react";
import {PAYMENT_METHODS, type PaymentMethod} from "@/constance";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {getPaymentMethodString} from "@/lib/utils.ts";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/components/Loading.tsx";
import {getSalesByPayment, type SalesByPayment} from "@/api/order.ts";
import {type Expense, getExpenses} from "@/api/expense.ts";
import {ExpenseTable} from "@/components/expense/ExpenseTable.tsx";

type Props = {
    open: boolean,
    onClose: () => void,
}

function DailyClosing({open, onClose}: Props) {
    const [type, setType] = useState<'income' | 'expense'>('income')
    const {data = {} as Record<PaymentMethod, SalesByPayment>, isLoading} = useQuery<
        Record<PaymentMethod, SalesByPayment>,
        Error
    >({
        queryKey: ['sale-by-payment'],
        queryFn: getSalesByPayment,
        staleTime: 5 * 60 * 1000,
    })
    const {data: expenses = [], isLoading: isExpenseLoading} = useQuery<Expense[], Error>({
        queryKey: ['expenses'],
        queryFn: () => getExpenses(),
        staleTime: 5 * 60 * 1000,
    })

    function getPaymentMethodValue(type: PaymentMethod) {
        const value = data[type]
        if (!value) return {count: 0, totalSales: 0}
        return value
    }

    const totalSales = Object.values(data).reduce((sum, item) => {
        return sum + (item?.totalSales ?? 0)
    }, 0)
    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
                <DialogContent className="min-w-[95vw] w-[95vw] h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className='text-black! font-bold! text-xl text-center'>Kết Toán Hàng
                            Ngày</DialogTitle>
                    </DialogHeader>
                    <ToggleGroup
                        size="lg"
                        variant="outline"
                        type="single"
                        value={type}
                        onValueChange={(value) => {
                            if (value) setType(value as 'income' | 'expense')
                        }}
                    >
                        <ToggleGroupItem className="w-20" value="income">
                            Thu nhập
                        </ToggleGroupItem>
                        <ToggleGroupItem className="w-20" value="expense">
                            Chi ra
                        </ToggleGroupItem>
                    </ToggleGroup>
                    {type === 'income' ?
                        <div className='flex border border-[#ccc] py-4 rounded px-6 flex-col gap-1 justify-center'>
                            {!isLoading && PAYMENT_METHODS.map((method) => {
                                return <div className='variant flex justify-start items-center gap-4 pt-2'>
                                    <Label className='block w-28 font-semibold'>{getPaymentMethodString(method)}</Label>
                                    <Input
                                        id={`amount-${method}`}
                                        value={getPaymentMethodValue(method).totalSales.toLocaleString()}
                                        className="w-40 text-center"
                                        disabled
                                    />
                                </div>
                            })}
                            <div className='variant flex justify-start items-center gap-4 pt-6 border-t mt-4'>
                                <Label className='block w-28 font-semibold'>Tổng</Label>
                                <Input id='amount' value={totalSales.toLocaleString()} className='w-40 text-center'
                                       disabled/>
                            </div>
                        </div> :
                        <div className='flex border border-[#ccc] px-6 py-4 rounded'>
                            {!isExpenseLoading && <ExpenseTable showOnly expenses={expenses}/>}
                        </div>}
                </DialogContent>
            </Dialog>
            {isLoading && <Loading/>}
        </>
    );
}

export default DailyClosing;