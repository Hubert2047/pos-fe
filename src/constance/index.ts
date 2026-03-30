import type {Order, OrderItem} from "@/api/order.ts";

export const DEFAULT_ORDER_ITEM: OrderItem = {
    id: '',
    itemId: '',
    name: '',
    quantity: 1,
    basePrice: 0,
    variant: '',
    addons: [],
    noteOptions: [],
    note: '',
}
export const DEFAULT_ORDER: Order = {
    _id: "",
    number: 1,
    items: [],
    status: 'pending',
    paymentMethod: 'cash',
    discount: null,
    type: 'takeaway',
    customer: null,
    checkoutPending: false,
}
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export const PAYMENT_METHODS = ['cash', 'uber', 'linepay', 'bank', 'foodpanda'] as const
export const TOKEN_STORAGE_KEY = 'token'