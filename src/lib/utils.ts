import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PaymentMethod } from '@/constance'

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
export function Print(content: string) {
    const invoiceContent = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
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
            @page { size: 80mm; margin: 0; }
            body { 
                font-family: 'Courier New', Courier, monospace; 
                width: 72mm; 
                margin: 0; 
                padding: 10px 2mm;
                background: white;
            }
            pre { 
                white-space: pre-wrap; 
                word-wrap: break-word;
                font-size: 13px; 
                line-height: 1.5;
                font-weight: bold;
                margin: 0;
            }
          </style>
        </head>
        <body>
          <pre>${invoiceContent}</pre>
          <script>
            window.onload = function() {
                window.focus();
                window.print();
            };
          </script>
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
