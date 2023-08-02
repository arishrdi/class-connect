import * as React from "react";
import { type UseFormRegister, type FieldValues } from "react-hook-form";

import { cn } from "~/utils/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, register, required = false, ...props }, ref) => {
    return (
      <div className="mb-3 flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          id={id}
          {...register(id, { required })}
          // ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
