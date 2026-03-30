import { Button } from '@/components/ui/button'
import { useState } from 'react'

type Props = {
    currentValue: string
    onChange: (newValue: string) => void
}
export default function NumPad({ currentValue, onChange }: Props) {
    const [isFirst, setIsFirst] = useState(true)
    const numbers = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['0', '00', 'clear'],
    ]

    function onChangeNumber(num: string) {
        let value = currentValue
        if (num === 'clear') {
            value = Math.floor(Number(value) / 10).toString()
        } else {
            if (isFirst) {
                value = num
                setIsFirst(false)
            } else {
                value = `${value}${num}`
            }
        }
        onChange(value)
    }

    return (
        <div className='grid grid-cols-3 gap-2 border-[#ccc] rounded w-64 border p-2'>
            {numbers.flat().map((num, idx) => (
                <Button
                    key={idx}
                    size='lg'
                    className={`text-lg ${
                        num === 'clear' ? 'bg-red-500 text-white' : num === 'enter' ? 'bg-green-500 text-white' : ''
                    }`}
                    onClick={() => onChangeNumber(num)}>
                    {num === 'clear' ? 'C' : num}
                </Button>
            ))}
        </div>
    )
}
