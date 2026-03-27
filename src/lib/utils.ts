import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function toggleArray<T>(arr: T[], item: T, key?: keyof T): T[] {
    if (key) {
        return arr.some((i) => i[key] === item[key]) ? arr.filter((i) => i[key] !== item[key]) : [...arr, item]
    }

    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}
