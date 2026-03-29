import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import DailyClosingStep1 from "@/components/daily-closing/DailyClosingStep1.tsx";
import DailyClosingStep2 from "@/components/daily-closing/DailyClosingStep2.tsx";

type Props = {
    open: boolean,
    onClose: () => void,
}

function DailyClosing({open, onClose}: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => {
                if (!isOpen) onClose()
            }}>
                <DialogContent className="min-w-[95vw] w-[95vw] h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className='text-black! font-bold! text-xl text-center'>Kết Toán Hàng
                            Ngày</DialogTitle>
                    </DialogHeader>
                    {currentStep === 1 && <DailyClosingStep1 setCurrentStep={setCurrentStep}/>}
                    {currentStep === 2 && <DailyClosingStep2 setCurrentStep={setCurrentStep}/>}
                </DialogContent>
            </Dialog>

        </>
    );
}

export default DailyClosing;