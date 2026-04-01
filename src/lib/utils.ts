import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PaymentMethod } from '@/constance'
import type { BaseOrder, OrderItem } from '@/api/order'

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
        case 'uber':
            return 'Uber'
        case 'foodpanda':
            return 'Foodpanda'
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

export function getPriceByType(
    type: 'dine_in' | 'takeaway' | 'uber' | 'foodpanda',
    price: { [key: string]: number | undefined },
): number {
    switch (type) {
        case 'dine_in':
        case 'takeaway':
            return price.base ?? 0
        case 'uber':
            return price.uber ?? 0
        case 'foodpanda':
            return price.foodpanda ?? 0
        default:
            return 0
    }
}
export function getPaymentMethodByType(type: 'dine_in' | 'takeaway' | 'uber' | 'foodpanda'): PaymentMethod {
    switch (type) {
        case 'dine_in':
        case 'takeaway':
            return 'cash'
        case 'uber':
            return 'uber'
        case 'foodpanda':
            return 'foodpanda'
        default:
            return 'cash'
    }
}
export function generateUUID() {
    if (crypto && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    } else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
    }
}
export function printReceipt(content: string) {
    const iframe = document.createElement('iframe')
    Object.assign(iframe.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: '0',
        height: '0',
        border: '0',
        visibility: 'hidden',
    })

    const htmlContent = `
            <html>
                <head>
                <meta charset="UTF-8">
                <style>
                    @page { size: 80mm auto; margin: 0; }
                    html, body { margin: 0; padding: 0; }
                    body { 
                        font-family: 'Courier New', Courier, monospace; 
                        width: 76mm;
                        padding: 2mm;
                    }
                    pre { 
                        white-space: pre-wrap; 
                        word-wrap: break-word;
                        font-size: 13px; 
                        line-height: 1.4;
                        font-weight: bold;
                        margin: 0;
                        padding: 0;
                    }
                </style>
                </head>
                <body>
                <pre>${content}</pre>
                </body>
            </html>
    `
    iframe.srcdoc = htmlContent
    document.body.appendChild(iframe)
    iframe.onload = () => {
        const fw = iframe.contentWindow
        if (fw) {
            fw.focus()
            fw.print()
            fw.onafterprint = () => {
                document.body.removeChild(iframe)
            }
        }
    }
}
export function generateKitchenReceipt(order: BaseOrder, item: OrderItem, index: number) {
    const lines: string[] = []
    lines.push('================================')
    lines.push(generateReceiptHeader(order))
    lines.push('================================')
    lines.push('')
    const qty = `x${item.quantity}`.padStart(4, ' ')
    lines.push(`${item.name.padEnd(20)}${qty}`)
    appendItemDetails(lines, item, false)
    lines.push('')
    lines.push(`        共 ${index + 1}/${order.items.length} 項`)
    lines.push('================================')
    return lines.join('\n')
}
export function generateReceipt(order: BaseOrder) {
    const lines: string[] = []
    lines.push('================================')
    lines.push(generateReceiptHeader(order))
    lines.push('================================')
    lines.push('')

    order.items.forEach((item, index) => {
        const qty = `x${item.quantity}`.padStart(4, ' ')
        const price = item.quantity * item.basePrice
        lines.push(`${index + 1}. ${item.name.padEnd(16)}  ${qty}  ${price.toLocaleString()}`)
        appendItemDetails(lines, item, true)
        lines.push('')
    })
    lines.push('================================')
    lines.push(`        共 ${order.items.length} 項`)
    lines.push('================================')

    return lines.join('\n')
}
function generateReceiptHeader(order: BaseOrder) {
    const time = new Date().toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const typeLabel =
        {
            takeaway: '外帶',
            dine_in: '內用',
            uber: 'Uber',
            foodpanda: 'FoodPanda',
        }[order.type] ?? ''

    return `  #${String(order.number).padStart(3, '0')}    ${typeLabel}    ${time}`
}
function appendItemDetails(lines: string[], item: OrderItem, hasPrintPrice = true) {
    if (item.variant !== '') {
        lines.push(`   特選: ${item.variant}`)
    }
    if (item.addons.length > 0) {
        lines.push('   加料:')
        item.addons.forEach((addon) => {
            const addonPrice = addon.priceExtra * addon.amount
            if (hasPrintPrice) lines.push(`   - ${addon.name} x${addon.amount}  ${addonPrice.toLocaleString()}`)
            else lines.push(`   - ${addon.name} x${addon.amount}`)
        })
    }
    if (item.noteOptions.length > 0) {
        lines.push('   不加:')
        item.noteOptions.forEach((option) => {
            lines.push(`   - ${option}`)
        })
    }
    if (item.note) {
        lines.push(`   備註: ${item.note}`)
    }
}
