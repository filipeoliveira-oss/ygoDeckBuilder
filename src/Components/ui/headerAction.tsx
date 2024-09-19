import { forwardRef, type ComponentProps } from "react";
import {tv, type VariantProps} from 'tailwind-variants'

const action = tv({
    variants:{
        variant:{
            primary:'text-neutral-100 text-base cursor-pointer relative before:absolute before:w-0 before:h-[2px] before:bottom-0 before:bg-violet-500 hover:before:animate-showBorder',
            disabled:'text-base text-zinc-500 pointer-events-none'
        }
    },

    defaultVariants:{
        variant:'primary'
    }
})

type LabelProps = ComponentProps<'label'> & VariantProps<typeof action>

export const Action = forwardRef<HTMLLabelElement,LabelProps>(
    ({ className, variant, ...props }, ref) => {
      return (
        <label
          {...props}
          ref={ref}
          className={action({ variant, className })}
        />
      )
    }
  )