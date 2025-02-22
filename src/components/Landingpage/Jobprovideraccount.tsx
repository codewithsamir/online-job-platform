"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { loginWithGoogle, signupUser } from "@/Ruduxtoolkit/authSlice";
import { GiCrossMark } from "react-icons/gi";
import { jobproviderActive, loginActive } from "@/Ruduxtoolkit/registerSlice";
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
import { toast } from "sonner";
import { useAppDispatch } from "@/Ruduxtoolkit/hook";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Import useState for loading state
import { FaGoogle } from "react-icons/fa";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Jobprovideraccount = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true); // Start loading
      const userData = {
        email: values.email,
        password: values.password,
        name: values.fullname,
        role: "job provider", // Assign role
      };
      // Dispatch signup action
      await dispatch(signupUser(userData)).unwrap();

      // Show success toast
      toast.success("Account created successfully!");

      // Redirect to the job provider dashboard
      router.push("/Jobprovider/dashboard");

      // Close the job provider registration form
      dispatch(jobproviderActive(false));

      // Reset form
      form.reset();
    } catch (error: any) {
      // Show error toast
      toast.error(error || "Failed to create account");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="main w-full fixed left-0 right-0 top-0 bottom-0 backdrop-blur-md z-50">
      <div className="formcontainer w-full sm:w-[500px] bg-[#af8dff65] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 px-5 sm:px-10 py-10 rounded-lg backdrop-blur-md">
        <h2 className="text-center font-bold text-white text-3xl mb-5">
          Create your free Job Provider Account
        </h2>
        <GiCrossMark
          className="text-3xl text-white cursor-pointer hover:text-red-500 absolute right-4 top-4"
          onClick={() => dispatch(jobproviderActive(false))}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-lg">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Full Name"
                      {...field}
                      className="placeholder:text-white text-white text-sm p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {/* Submit Button */}
            <div className="btn pt-2">
              <Button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-600 text-xl"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? "Creating account..." : "Submit"}
              </Button>
            </div>

                {/* Google Sign In */}
                        <div className="google-btn pt-2 sm:flex gap-1 justify-center items-center w-full">
                          <Button 
                          className="w-full"
                          onClick={() => {
                         dispatch(loginWithGoogle({role:"job provider"}))
                           
                          }}
                          >
                            
                          <FaGoogle className="text-3xl text-red-500" />
                          Signup with Google
                          </Button>
                          
                        </div>
            {/* Login Link */}
            <div className="btn pt-2 sm:flex gap-1 justify-center items-center">
              <p className="text-lg text-white">Already have a job seeker account?</p>
              <Button
                variant={"link"}
                onClick={() => {
                  dispatch(jobproviderActive(false));
                  dispatch(loginActive(true));
                }}
                className="text-pink-500 text-lg p-0"
              >
                Log in
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Jobprovideraccount;