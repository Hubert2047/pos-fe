import api from './axios'

export interface Category {
    _id: string
    name: string
}

export const getCategories = async (): Promise<Category[]> => {
    const res = await api.get('categories').then((data) => data.data)
    return res.data
}

export const createCategory = async (name: string) => {
    const res = await api.post('categories', { name })
    return res.data
}

export const deleteCategory = async (id: string) => {
    const res = await api.delete(`categories/${id}`)
    return res.data
}

// Sửa category
export const updateCategory = async (id: string, name: string) => {
    const res = await api.put(`categories/${id}`, { name })
    return res.data
}
