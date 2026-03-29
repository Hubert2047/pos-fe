import api from './axios'
import type {PaymentMethod} from "@/constance";

export interface OrderItem {
    id: string
    itemId: string
    name: string
    quantity: number
    basePrice: number
    variant: string
    addons: OrderItemAddon[]
    noteOptions: string[]
    note: string
}

interface Customer {
    name: string
    phone: string
}

interface OrderItemAddon {
    id: string
    name: string
    priceExtra: number
    amount: number
}

export interface OrderDiscount {
    name: string
    amount: number
    type: 'percent' | 'value'
}

interface BaseOrder {
    _id: string
    number: number
    items: OrderItem[]
    status: 'pending' | 'paid' | 'cancelled'
    paymentMethod: PaymentMethod
    discount: OrderDiscount | null
    type: 'dine_in' | 'takeaway' | 'uber' | 'foodpanda'
    customer: Customer | null
    checkoutPending: boolean

}

export type Order = BaseOrder

export interface IOrder extends BaseOrder {
    _id: string
    totalPrice: number
    createdAt: Date
}

export type SalesByPayment = {
    _id: string
    totalSales: number
    count: number
}
export const getOrders = async (days?: number): Promise<IOrder[]> => {
    const res = await api.get('orders', {params: days ? {days} : {}})
    return res.data.data
}
export const getNextOrderNumber = async (): Promise<number> => {
    const res = await api.get('orders/next-order-number')
    return res.data.nextNumber
}
export const fetchOrderById = async (id: string): Promise<Order> => {
    const res = await api.get(`orders/${id}`)
    return res.data.data
}

export const createOrder = async (order: Order): Promise<number> => {
    const res = await api.post('orders', order)
    return res.data.data
}
export const cancelOrder = async (id: string): Promise<Order> => {
    const res = await api.patch(`orders/${id}/cancel`)
    return res.data.data
}
export const updateOrder = async (id: string, data: Partial<Order>): Promise<Order> => {
    const res = await api.put(`orders/${id}`, data)
    return res.data.data
}

export const deleteOrder = async (id: string) => {
    const res = await api.delete(`orders/${id}`)
    return res.data
}
export const getSalesByPayment = async (): Promise<Record<PaymentMethod, SalesByPayment>> => {
    const res = await api.get('/orders/sales-by-payment')
    return res.data.data
}
