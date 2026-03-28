import {Spinner} from "@/components/ui/spinner.tsx";

function Loading() {
    return (
        <div className='fixed inset-0 z-99999 flex items-center justify-center bg-black/20'>
            <Spinner/>
        </div>
    );
}

export default Loading;