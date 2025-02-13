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
import {  GiCrossMark } from "react-icons/gi"
import { FaGoogle } from "react-icons/fa"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { categoriActive, forgotpasswordActive, loginActive } from "@/Ruduxtoolkit/registerSlice"
// import Image from "next/image"
 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})


const Login = () => {

 const dispatch = useDispatch()

      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
  <div className="main w-full fixed left-0 right-0 top-0 bottom-0 backdrop-blur-md z-50">
      <div className="formcontainer w-full sm:w-[500px] bg-[#af8dff65] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 px-5 sm:px-10 py-10  rounded-lg backdrop-blur-md">
    <GiCrossMark className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4" 
    onClick={()=>dispatch(loginActive(false))}
    />
    <h2 className="text-center font-bold  text-white text-3xl mb-5">Login</h2>
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-lg">Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Username " {...field} className="placeholder:text-white text-white text-sm p-4" />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-lg">Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Password" {...field} className="placeholder:text-white text-white text-sm p-4" />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
       <div className="btn pt-2">
       <Button type="submit" className="w-full bg-pink-400 hover:bg-pink-600 text-xl ">Submit</Button>
       </div>
 
      </form>
      <div className="forgot text-center py-2">
    <Button variant={"link"} 
    onClick={()=>{
      dispatch(forgotpasswordActive(true))
      dispatch(loginActive(false))
    
    }}
    className="text-pink-500 text-lg">forgot password</Button>
    </div>
    {/* <div className="btn pt-2">
       <Button  className="w-full bg-transparent hover:text-white border-2 border-pink-600 hover:bg-pink-400 sm:text-xl ">Login with Google 
        <Image src="/googleicon.png" alt="google" width={30} height={30} className="w-[30px] h-[30px] ml-4" />
       </Button>
       </div> */}
    <div className="btn pt-2  sm:flex gap-1  justify-center items-center ">
        <p className="text-lg text-white">Don't have an account?</p>
       <Button variant={"link"} 
       onClick ={()=>{
        dispatch(loginActive(false))
        dispatch(categoriActive(true))
       }}
       className="text-pink-500 text-lg p-0">Create New Account</Button>
       </div>
    </Form>
   </div>
  </div>
  )
}

export default Login