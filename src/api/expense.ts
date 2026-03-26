import api from './axios'

export interface Expense {
    _id: string
    name: string
    price: number
    note?: string
    createdAt: string
    updatedAt: string
}

export interface CreateExpense {
    name: string
    price: number
    note?: string
}

export const getExpenses = async (): Promise<Expense[]> => {
    const res = await api.get('expenses')
    return res.data.data
}

export const fetchExpenseById = async (id: string): Promise<Expense> => {
    const res = await api.get(`expenses/${id}`)
    return res.data.data
}

export const createExpense = async (data: CreateExpense): Promise<Expense> => {
    return api.post('expenses', data)
}

export const updateExpense = async (id: string, data: Partial<CreateExpense>): Promise<Expense> => {
    const res = await api.put(`expenses/${id}`, data)
    return res.data.data
}

export const deleteExpense = async (id: string) => {
    const res = await api.delete(`expenses/${id}`)
    return res.data
}
