
import {Root, Indicator, } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export default function Checkbox({changeFunction, identifier, checked}: {changeFunction:Function, identifier:string, checked?:boolean}){
    return (
        <form>
            <div className="flex items-center outline-none">
                <Root
                    className="flex size-[25px] appearance-none items-center justify-center rounded bg-white  outline-none "
                    id={identifier}
                    onCheckedChange={(e) => changeFunction(e)}
                    name={identifier}
                    defaultChecked={checked || false}
                >
                    <Indicator className="text-[#8b5cf6] outline-none">
                        <Check />
                    </Indicator>
                </Root>
              
            </div>
        </form>
    );
}

