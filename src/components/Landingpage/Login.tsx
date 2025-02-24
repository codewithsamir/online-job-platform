"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GiCrossMark } from "react-icons/gi";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { categoriActive, forgotpasswordActive, loginActive } from "@/Ruduxtoolkit/registerSlice";
import { loginUser, loginWithGoogle } from "@/Ruduxtoolkit/authSlice"; // Import loginUser action
import { useAppDispatch, useAppSelector } from "@/Ruduxtoolkit/hook"; // Import typed useSelector
import { toast } from "sonner"; // For notifications
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [googlelogin , setgooglelogin] =  useState(false); // Google login state
  const [role, setrole] = useState("User"); //

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true); // Start loader
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        })
      ).unwrap();
// console.log(result.user?.prefs?.role)
      // Show success toast
      toast.success(result.message);

 
        router.push(`/${role}/dashboard`);
     
    } catch (error: any) {
      // Show error toast
      toast.error(error || "Failed to log in");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div className="main w-full fixed left-0 right-0 top-0 bottom-0 backdrop-blur-md z-50">
      <div className="formcontainer w-full sm:w-[500px] bg-[#af8dff65] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 px-5 sm:px-10 py-10 rounded-lg backdrop-blur-md">
        <GiCrossMark
          className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4"
          onClick={() => dispatch(loginActive(false))}
        />
        <h2 className="text-center font-bold text-white text-3xl mb-5">Login</h2>
        <Form {...form}>
          {!googlelogin  &&
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Email"
                      {...field}
                      className="placeholder:text-white text-white text-sm p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Password"
                      {...field}
                      className="placeholder:text-white text-white text-sm p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<div className="google-btn pt-2 sm:flex gap-1 justify-center items-center w-full">
           
           <Select 
           onValueChange={(value) => setrole(value) }
           >
<SelectTrigger className="w-full bg-[#471045c4] border-none text-white">
 <SelectValue placeholder="Select to continue or log in with Google." />
</SelectTrigger>
<SelectContent>
 <SelectItem value="job seeker">job seeker</SelectItem>
 <SelectItem value="job provider">job provider</SelectItem>
 
</SelectContent>
</Select>
     
        
      </div>

            {/* Submit Button */}
            <div className="btn pt-2">
              <Button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-600 text-xl"
                disabled={isLoading} // Disable button during loading
              >
                {isLoading ? "Logging in..." : "Submit"}
              </Button>
            </div>
            </form>
            }
            {/* Forgot Password */}
            <div className="forgot text-center py-2">
              <Button
                variant={"link"}
                onClick={() => {
                  dispatch(forgotpasswordActive(true));
                  dispatch(loginActive(false));
                }}
                className="text-pink-500 text-lg"
              >
                Forgot Password?
              </Button>
            </div>

            {/* Google Sign In */}
            {

!googlelogin 
&& 
<div className="google-btn pt-2 sm:flex gap-1 justify-center items-center w-full">
<Button 
className="w-full"
onClick={() => {
setgooglelogin(true)

}}
>
  
<FaGoogle className="text-3xl text-red-500" />
Sign in with Google
</Button>

</div>
            }
         
            

         {googlelogin && 
            <div className="google-btn pt-2 sm:flex gap-1 justify-center items-center w-full">
           
                 <Select 
                 onValueChange={(value) => dispatch(loginWithGoogle({role: value })  )}
                 >
     <SelectTrigger className="w-full bg-black border-none text-white">
       <SelectValue placeholder="Please select a role to continue." />
     </SelectTrigger>
     <SelectContent>
       <SelectItem value="job seeker">job seeker</SelectItem>
       <SelectItem value="job provider">job provider</SelectItem>
       
     </SelectContent>
   </Select>
           
              
            </div>
              }

            {/* Create New Account */}
            <div className="btn pt-2 sm:flex gap-1 justify-center items-center">
              <p className="text-lg text-white">Don't have an account?</p>
              <Button
              
                variant={"link"}
                onClick={() => {
                  dispatch(loginActive(false));
                  dispatch(categoriActive(true));
                }}
                className="text-pink-500 text-lg p-0"
              >
                <span className="text-xl">
                Create New Account
                </span>
              </Button>
            </div>
        
        </Form>
      </div>
    </div>
  );
};

export default Login;