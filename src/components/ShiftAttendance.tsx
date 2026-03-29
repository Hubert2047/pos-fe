import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";

type Props = {
    open: boolean
    onClose: () => void
}

function ShiftAttendance({open, onClose}: Props) {
    const [staffId, setStaffId] = useState("");
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
            <DialogContent className=" min-h-[50vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className='text-black! font-bold! text-xl text-center'>Chấm công</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 px-2">
                    <span className='font-bold text-md'>Mã nhân viên</span>
                    <Input
                        value={staffId}
                        className=" w-48 ml-2"
                        onChange={(e) => setStaffId(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between mt-4 gap-2 px-2">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                        Vào làm
                    </Button>

                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                        Tan làm
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ShiftAttendance;