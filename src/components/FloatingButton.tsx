import {Button} from '@/components/ui/button'
import {ChevronLeft, ChevronRight} from "lucide-react";
import React from "react";

type Props = {
    open: boolean,
    setOpenBtns: React.Dispatch<React.SetStateAction<boolean>>
}

export function FloatingButton({open, setOpenBtns}: Props) {

    return (
        <Button
            className="fixed top-14 bg-gray-900 right-1 h-8 w-8 rounded-full shadow-lg"
            size="icon"
            onClick={() => setOpenBtns(!open)}
        >
            {open ? <ChevronLeft/> : <ChevronRight/>}
        </Button>
    )
}