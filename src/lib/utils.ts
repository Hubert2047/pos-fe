import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getStatusString(status: string) {
    switch (status) {
        case 'pending':
            return 'Chờ thanh toán'
        case 'paid':
            return 'Đã thanh toán'
        case 'cancelled':
            return 'Đã hủy'
        default:
            return status
    }
}
export function getOrderTypeString(type: string) {
    switch (type) {
        case 'dine_in':
            return 'Tại quán'
        case 'takeaway':
            return 'Mang đi'
        default:
            return type
    }
}
export function getPaymentMethodString(method: string) {
    switch (method) {
        case 'cash':
            return 'Tiền mặt'
        case 'uber':
            return 'Uber'
        case 'linepay':
            return 'Linepay'
        case 'bank':
            return 'Ngân hàng'
        case 'foodpanda':
            return 'Foodpanda'
        default:
            return method
    }
}