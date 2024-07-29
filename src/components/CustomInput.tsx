import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form"
import { Input } from "@/components/ui/input"

import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from "@/../lib/schema"

const authForm = authFormSchema("sign-up")

interface CustomInput {
  control: Control<z.infer<typeof authForm>>,
  // NOTE: "email" | "password" would work, but we will need to edit it on adding new fields. Hence, we are taking an inference of what this might be from authForm
  name: FieldPath<z.infer<typeof authForm>>,
  label: string,
  placeholder: string,
  type: string,
}

const CustomInput = ({control, name, label, placeholder, type}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input 
                placeholder={placeholder}
                className="input-class"
                type={type}
                {...field} 
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput