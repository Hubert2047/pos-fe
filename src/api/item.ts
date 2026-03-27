import api from './axios'

export interface Item {
    _id: string
    name: string
    categoryName: string
    basePrice: number
    addons: Addon[]
    variants: string[]
    noteOptions: string[]
    active: boolean
}
interface Addon {
    _id: string
    name: string
    priceExtra: number
}
export const getItems = async (active = true): Promise<Item[]> => {
    const res = await api.get(`items?active=${active}`)
    return res.data.data
}
