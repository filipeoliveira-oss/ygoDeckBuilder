import { RingLoader } from "react-spinners";

export default function ScreenLoader(){
    return(
        <div className="bg-[rgba(0,0,0,0.5)] w-screen h-screen absolute z-30 flex items-center justify-center">
            <RingLoader color="#8b5cf6" size={150}/>
        </div>
    )
}