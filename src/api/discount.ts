import api from './axios'

export interface Discount {
    _id: string
    name: string
    amount: number
    type: 'percent' | 'value'
    note: string
    active: boolean
}

export const getDiscounts = async (): Promise<Discount[]> => {
    const res = await api.get('discounts')
    return res.data.data
}

