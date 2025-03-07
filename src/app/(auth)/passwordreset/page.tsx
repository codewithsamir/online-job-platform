"use client";

import { useState,Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { confirmupdatapassword } from "@/Ruduxtoolkit/resetpasswordSlice";
import { useAppDispatch } from "@/Ruduxtoolkit/hook";


// Schema validation using Zod
const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

interface datas{
    password:string;
    id:string ;
    secret:string ;
}

const  ResetPassword = ()=> {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const secret = searchParams.get("secret");
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

 // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    try {
        const data:datas = {
            password:values.password,
            id:userId || "",
            secret:secret || ""
    
        }
        await dispatch(confirmupdatapassword(data)).unwrap()
        toast.success("successfully password changed")
        router.push("/")
        setIsLoading(true)
    } catch (error) {
        toast.error("Somethng went wrong ! password doesnot changed")
        
    }
    
      
    
  }

  return (
    <div className="bg-[#5B3E81] w-full min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-md p-4 bg-[#af8dff56] text-white">
        <CardHeader>
          <CardTitle className="text-center text-xl ">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
        <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-sm">password</FormLabel>
            <FormControl>
              <Input placeholder="Enter your password" {...field}
              className="placeholder:text-white text-white text-sm p-4"
              />
            </FormControl>
        
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-sm">confirmPassword</FormLabel>
            <FormControl>
              <Input placeholder="Enter your confirmpassword" {...field}
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
    
  </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap the component in a Suspense boundary
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};
export default ResetPasswordPage;

