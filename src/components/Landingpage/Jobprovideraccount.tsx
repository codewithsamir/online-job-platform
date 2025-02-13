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
import {  jobproviderActive, loginActive } from "@/Ruduxtoolkit/registerSlice"
import { useDispatch } from "react-redux"
import Image from "next/image"
 
const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),

  mobilenumber: z.number().min(10, {
    message: "mobile numebr must be  10 digit",
  }).max(10,{
    message: "mobile numebr must be  10 digit",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
})

const Jobprovideraccount = () => {
    const dispatch = useDispatch()
     // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email:"",
      mobilenumber:1234567890,
      password:"",
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

<h2 className="text-center font-bold  text-white text-3xl mb-5">Create your free Job Provider Account</h2>

<GiCrossMark className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4" 
    onClick={()=>dispatch(jobproviderActive(false))}
    />

     <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="fullname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-lg">Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your Full Name" {...field}
              className="placeholder:text-white text-white text-sm p-4"
              />
            </FormControl>
        
            <FormMessage />
          </FormItem>
        )}
      />
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
      <FormField
        control={form.control}
        name="mobilenumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-lg">Mobile Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your Mobile Number" {...field}
              className="placeholder:text-white text-white text-sm p-4"
              />
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
              <Input placeholder="Enter your Password" {...field}
              className="placeholder:text-white text-white text-sm p-4"
              />
            </FormControl>
        
            <FormMessage />
          </FormItem>
        )}
      />
     <div className="btn pt-2">
       <Button type="submit" className="w-full bg-pink-400 hover:bg-pink-600 text-xl ">Submit</Button>
       </div>
    </form>
    <div className="btn pt-2  sm:flex gap-1  justify-center items-center">
        <p className="text-lg text-white">Already have jobseeker account? </p>
       <Button variant={"link"} 
       onClick = {()=>{
        dispatch(jobproviderActive(false))
        dispatch(loginActive(true))
       }}
       className="text-pink-500 text-lg p-0"> Log in</Button>
       </div>

       <div className="btn pt-2">
       <Button  className="w-full bg-transparent hover:text-white border-2 border-pink-600 hover:bg-pink-400 sm:text-xl ">Login with Google 
        <Image src="/googleicon.png" alt="google" width={30} height={30} className="w-[30px] h-[30px] ml-4" />
       </Button>
       </div>
  </Form>
   </div>
   </div>
  )
}

export default Jobprovideraccount;