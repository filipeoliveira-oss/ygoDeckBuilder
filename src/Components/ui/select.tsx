import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";

import "./selectElement.css";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Tables } from "../../helpers/supabase";

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
    children: React.ReactNode;
    className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, ...props }, forwardedRef) => {
        return (
            <Select.Item
                className={classnames("SelectItem", className)}
                {...props}
                ref={forwardedRef}
            >
                <Select.ItemText>{children}</Select.ItemText>
                <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                </Select.ItemIndicator>
            </Select.Item>
        );
    }
);

export default function SelectElement({ values, changeFunction, placeholder,label }: { values: Array<Tables<'competitors'> | number>, changeFunction:Function, placeholder:string, label:string}) {
    
    return (
        <Select.Root onValueChange={(e) => changeFunction(e)}>
            <Select.Trigger className="SelectTrigger capitalize min-w-44 relative" aria-label="competitor">
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="SelectContent">
                    <Select.ScrollUpButton className="SelectScrollButton">
                        <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="SelectViewport ">
                        <Select.Group>
                            <Select.Label className="SelectLabel">{label}</Select.Label>
                            {values?.map((value: Tables<'competitors'> | number, index:number) => {
                                return (
                                    <React.Fragment key={index}>
                                        {typeof value === 'number' ? 
                                            <SelectItem value={String(value)} className="capitalize cursor-pointer">{value}</SelectItem>
                                        :
                                            <SelectItem value={String(value.competitor_id)} className="capitalize cursor-pointer">{value.name}</SelectItem>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="SelectScrollButton">
                        <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}

