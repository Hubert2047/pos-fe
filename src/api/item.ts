import api from './axios'

export type PriceType = {
    base?: number
    uber?: number
    foodpanda?: number
    [key: string]: number | undefined
}
export interface Item {
    _id: string
    name: string
    categoryName: string
    price: PriceType
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
