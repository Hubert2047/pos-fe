import api from './axios'

export type CashData = {
    [denomination: number]: string
}

export interface IDailyClosing {
    _id: string
    actualTotal: number
    systemAmount: number
    cash: CashData
    reason: string
    createdAt: string
    updatedAt: string
}

export interface ICreateDailyClosing {
    actualTotal: number
    systemAmount: number
    cash: CashData
    reason: string
}

export interface IUpdateDailyClosing extends ICreateDailyClosing {
    _id: string
}

export const getRevenues = async (date?: string): Promise<IDailyClosing[]> => {
    const res = await api.get('daily-closing', {
        params: date ? { date } : {},
    })
    return res.data.data
}

export const createRevenue = async (data: ICreateDailyClosing): Promise<IDailyClosing> => {
    return api.post('daily-closing', data)
}

export const updateRevenue = async ({
    id,
    data,
}: {
    id: string
    data: Partial<IUpdateDailyClosing>
}): Promise<IUpdateDailyClosing> => {
    const res = await api.put(`daily-closing/${id}`, data)
    return res.data.data
}

export const deleteRevenue = async (id: string) => {
    const res = await api.delete(`daily-closing/${id}`)
    return res.data
}
