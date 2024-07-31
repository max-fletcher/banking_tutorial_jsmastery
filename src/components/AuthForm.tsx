"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import CustomInput from "./CustomInput"
import { authFormSchema } from "@/../lib/schema"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "../../lib/actions/user.actions"

const AuthForm = ({ type } : {type: string} ) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const formSchema = authFormSchema(type)

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: SignUpParams) => {
      setIsLoading(true)
      try {
        // Sign up with AppWrite and create plaid token
        if(type === "sign-up"){
          const newUser = await signUp(data)
          setUser(newUser)
        }
        // NOTE: else condition here throws type error in response(An expression of type 'void' cannot be tested for truthiness) so we are using an if statement.
        if(type === "sign-in"){
          const response = await signIn({
            email: data.email,
            password: data.password,
          })

          if(response !== null) router.push('/') // Navigate to homepage if logged in
        }
      } catch (error) {
        console.log(error)
      }
      finally{
        setIsLoading(false)
      }
    }

    return (
      <section className="auth-form">
        <header className="flex flex-col gap-5 md:gap-8">
          <Link href="/" className="flex cursor-pointer items-center gap-1">
            <Image 
              src="/icons/logo.svg" 
              width={34} 
              height={34} 
              alt="Horizon logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
          </Link>

          <div className="flex flex-col gap-1 md:gap-3">
            <h1>
              { user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up" }
              <p className="text-16 font-normal text-gray-600">
                { user ? "Link your account to get started" : "Please enter your details" }
              </p>
            </h1>
          </div>
        </header>
        { user ? (
          <div className="flex flex-col gap-4">
            {/* PlaidLink */}
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {
                  type === "sign-up" && (
                    <>
                      <div className="flex gap-4">
                        <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" type="text" />
                        <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" type="text" />
                      </div>
                      <CustomInput control={form.control} name="address1" label="Address" placeholder="Enter your specific address" type="text" />
                      <CustomInput control={form.control} name="city" label="City" placeholder="Enter your city" type="text" />
                      <div className="flex gap-4">
                        <CustomInput control={form.control} name="state" label="State" placeholder="Enter your state e.g NY" type="text" />
                        <CustomInput control={form.control} name="postalCode" label="Postal Code" placeholder="Enter postal code e.g 12110" type="text" />
                      </div>
                      <div className="flex gap-4">
                        <CustomInput control={form.control} name="dateOfBirth" label="Date of birth" placeholder="YYYY-MM-DD" type="text" />
                        <CustomInput control={form.control} name="ssn" label="SSN" placeholder="Enter SSN no. e.g 1234" type="text" />
                      </div>
                    </>
                  )
                }
                <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" type="text" />
                <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />

                <div className="flex flex-col gap-4">
                  <Button type="submit" className="form-btn" disabled={isLoading}>
                    {isLoading ?
                      <>
                        {/* Spinner/loader component. Comes from lucide-react. Got installed when we installed the sheet component from shadcn. */}
                        <Loader2 size={20} className="animate-spin mr-2" />
                        Loading...
                      </> 
                      : 
                      type === "sign-in" ? "Sign In" : "Sign Up"
                    }
                  </Button>
                </div>
              </form>
            </Form>

            <footer className="flex justify-center gap-1">
              <p className="text-14 font-normal text-gray-600">
                {type === "sign-in" ? "Don't have an account ?" : "Already have an account ?"}
              </p>
              <Link href={type === 'sign-in' ? 'sign-up' : 'sign-in'} className="form-link">
                {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
              </Link>
            </footer>
          </>
        )}
      </section>
    )
}

export default AuthForm