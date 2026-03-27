import api from './axios'
export interface OrderItem {
    id: string
    name: string
    quantity: number
    basePrice: number
    variant: string
    addons: OrderItemAddon[]
    noteOptions: string[]
    note: string
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
export interface Order {
    number: number
    items: OrderItem[]
    totalPrice: number
    status: 'pending' | 'paid' | 'cancelled'
    paymentMethod: 'cash' | 'uber' | 'linepay' | 'bank' | 'foodpanda'
    discount: OrderDiscount | null
    type: 'dine_in' | 'takeaway'
}

export const fetchOrders = async (): Promise<Order[]> => {
    const res = await api.get('orders')
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

export const createOrder = async (items: OrderItem[]): Promise<Order> => {
    const res = await api.post('orders', { items })
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
