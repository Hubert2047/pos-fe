import {Button} from "@/components/ui/button";

type Props = {
    onChange: (newValue: string) => void;
};
export default function NumPad({onChange}: Props) {

    const numbers = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["0", "00", "clear"],
    ];

    return (
        <div className="grid grid-cols-3 gap-2 border-[#ccc] rounded w-64 border p-2">
            {numbers.flat().map((num, idx) => (
                <Button
                    key={idx}
                    size='lg'
                    className={`text-lg ${
                        num === "clear"
                            ? "bg-red-500 text-white"
                            : num === "enter"
                                ? "bg-green-500 text-white"
                                : ""
                    }`}
                    onClick={() => onChange(num)}
                >
                    {num === "clear" ? "C" : num === "enter" ? "OK" : num}
                </Button>
            ))}
        </div>
    );
}

