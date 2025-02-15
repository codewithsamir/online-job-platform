"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/Ruduxtoolkit/hook";
import { addCandidate } from "@/Ruduxtoolkit/candidateSlice"; // Import candidateSlice action
import { toast } from "sonner"; // For toast notifications

// Define the form schema using Zod
const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters long.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters long.",
  }),
  contact: z
    .string()
    .length(10, {
      message: "Contact number must be exactly 10 digits.",
    })
    .regex(/^\d+$/, { message: "Contact number must contain only digits." }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters long.",
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Invalid gender selection.",
  }),
  education: z.string().min(2, {
    message: "Education field must be at least 2 characters long.",
  }),
  skills: z.string().min(2, {
    message: "Skills field must be at least 2 characters long.",
  }),
  dateofbirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date of birth must be in YYYY-MM-DD format.",
  }),
  experience: z.string().min(2, {
    message: "Experience field must be at least 2 characters long.",
  }),
  nationality: z.string().min(2, {
    message: "Nationality must be at least 2 characters long.",
  }),
 
  image: z
    .instanceof(File, {
      message: "An image file is required.",
    })
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "Image size must be less than 5MB.",
    })
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      {
        message: "Only PNG, JPG, or JPEG images are allowed.",
      }
    ),
});

const UserProfileform = () => {
  const [dob, setDob] = React.useState<Date | undefined>(undefined); // Date of birth state
  const [isLoading, setIsLoading] = React.useState(false); // Loading state
  const dispatch = useAppDispatch();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      contact: "",
      address: "",
      gender: undefined,
      education: "",
      skills: "",
      dateofbirth: "",
      experience: "",
      nationality: "",
      
      image: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   
    setIsLoading(true); // Stop loading

     try{
       // Dispatch the addCandidate action
       const fullName = `${values.firstname} ${values.lastname}`
       const {address,contact:phone,dateofbirth,education,experience,gender,image} = values
       await dispatch(addCandidate({
        fullName,
        address,phone,dateofbirth,education,experience,gender,image
       })).unwrap();

       // Show success toast
       toast.success("Profile updated successfully!");
 
       // Reset the form
       form.reset();
     }
     catch (error: any) {
      // Show error toast
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-[#5b3e8141]  text-white p-6 rounded-lg w-[550px] mx-auto">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 items-center">
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

  

        {/* Contact Number */}
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skills */}
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input placeholder="Enter your skills" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Education */}
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <FormControl>
                <Input placeholder="Enter your education details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

   
        {/* Experience */}
        <FormField
          control={form.control}
          name="dateofbirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>dateofbirth</FormLabel>
              <FormControl>
                <Input placeholder="Enter your dateofbirth" type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Experience */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="Enter your experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input placeholder="Enter your nationality" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Picture */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button  className="col-span-2 w-full bg-primary hover:bg-primary-dark text-white" type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
    </div>
  );
};

export default UserProfileform;