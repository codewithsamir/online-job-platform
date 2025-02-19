"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { GiCrossMark } from "react-icons/gi"
import { forgotpasswordActive, loginActive } from "@/Ruduxtoolkit/registerSlice"

import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook"
import { updatepassword } from "@/Ruduxtoolkit/resetpasswordSlice"
import { useState } from "react"
 
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }), // Corrected email validation
})



const Forgotpassword = () => {
  const [isLoading  , setIsLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    
    dispatch(updatepassword(values))
    .then((res)=>setIsLoading(true))
    .catch((err)=>setIsLoading(false))
  }
  return (

    <div className="main w-full fixed left-0 right-0 top-0 bottom-0 backdrop-blur-md z-50">
    <div className="formcontainer w-full sm:w-[500px] bg-[#af8dff65] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 px-5 sm:px-10 py-10  rounded-lg backdrop-blur-md">

<h2 className="text-center font-bold  text-white text-3xl mb-5">Forgot password</h2>

<GiCrossMark className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4" 
    onClick={()=>dispatch(forgotpasswordActive(false))}
    />

     <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-lg">Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter your Email" {...field}
              className="placeholder:text-white text-white text-sm p-4"
              />
            </FormControl>
        
            <FormMessage />
          </FormItem>
        )}
      />
     <div className="btn pt-2">
       <Button type="submit" 
        disabled={isLoading}
       className="w-full bg-pink-400 hover:bg-pink-600 text-xl ">Submit</Button>
       </div>
    </form>
    <div className="btn pt-2  sm:flex gap-1  justify-center items-center">
        <p className="text-lg text-white">Remember your password? </p>
       <Button variant={"link"} 
       onClick = {()=>{
        dispatch(forgotpasswordActive(false))
        dispatch(loginActive(true))
       }}
      
       className="text-pink-500 text-lg p-0">go to Login</Button>
       </div>
  </Form>
   </div>
   </div>
  )
}

export default Forgotpassword