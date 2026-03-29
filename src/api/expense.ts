import api from './axios'

export interface Expense {
    _id: string
    name: string
    price: number
    note?: string
    createdAt: string
    updatedAt: string
}

export interface ICreateExpense {
    name: string
    price: number
    note?: string
}
export interface IUpdateExpense extends ICreateExpense {
    _id: string
}

export const getExpenses = async (date?: string): Promise<Expense[]> => {
    const res = await api.get('expenses', {
        params: date ? { date } : {}
    })
    return res.data.data
}

export const fetchExpenseById = async (id: string): Promise<Expense> => {
    const res = await api.get(`expenses/${id}`)
    return res.data.data
}

export const createExpense = async (data: ICreateExpense): Promise<Expense> => {
    return api.post('expenses', data)
}

export const updateExpense = async ({id, data}: {
    id: string
    data: Partial<ICreateExpense>
}): Promise<IUpdateExpense> => {
    const res = await api.put(`expenses/${id}`, data)
    return res.data.data
}

export const deleteExpense = async (id: string) => {
    const res = await api.delete(`expenses/${id}`)
    return res.data
}
