import api from './axios'

export interface IShiftAttendance {
    employeeId: string
    numberId: string
    checkIn?: Date
    checkOut?: Date
    workingHours?: number
    status: 'working' | 'done'
    date: string
}
export const checkInOrOut = async (numberId: string): Promise<IShiftAttendance> => {
    const res = await api.post('shift-attendance/check-in-out', {numberId})
    return res.data.data
}
