import api from './axios'

export interface Item {
    _id: string
    name: string
    categoryName: string
    basePrice: number
    modifiers: string[]
    noteOptions: string[]
}

export const getItems = async (): Promise<Item[]> => {
    const res = await api.get('/api/items')
    return res.data.data
}
