"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Calendar } from '../ui/calendar'
 
import { cn } from "@/lib/utils"


const formSchema = z.object({
    firstname: z.string().min(2, {
      message: "First name must be at least 2 characters long.",
    }),
    lastname: z.string().min(2, {
      message: "Last name must be at least 2 characters long.",
    }),
    contact: z.string()
      .length(10, {
        message: "Contact number must be exactly 10 digits.",
      })
      .regex(/^\d+$/, { message: "Contact number must contain only digits." }),
    address: z.string().min(2, {
      message: "Address must be at least 2 characters long.",
    }),
    gender: z.enum(["Male", "Female", "Other"], {
      message: "Invalid gender selection.",
    }),
    education: z.string().min(2, {
      message: "Education field must be at least 2 characters long.",
    }),
    skills: z.string().min(2, {
      message: "Skills field must be at least 2 characters long.",
    }),
    dateofbirth: z.string().regex(
      /^\d{4}-\d{2}-\d{2}$/,
      { message: "Date of birth must be in YYYY-MM-DD format." }
    ),
    experience: z.string().min(2, {
      message: "Experience field must be at least 2 characters long.",
    }),
    nationality: z.string().min(2, {
      message: "Nationality must be at least 2 characters long.",
    }),
    email: z.string().min(2, {
      message: "email must be valid.",
    }),
    image: z
      .instanceof(File, {
        message: "An image file is required.",
      })
      .refine((file) => file.size < 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB.",
      })
      .refine((file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type), {
        message: "Only PNG, JPG, or JPEG images are allowed.",
      }),
  });


  
const UserProfileform = () => {
    const [dob, setdob] = React.useState<Date>()
      // 1. Define your form.
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
        email:""
    },
  })

// userid required 


   // 2. Define a submit handler.
   function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
   
   <div className="p-4 bg-[#af8dff48] w-[70%] m-auto rounded-lg ">
     <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className=" grid grid-cols-2 items-center gap-5">
      <FormField
        control={form.control}
        name="firstname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">First Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your firstname" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your last name" {...field} className='text-white' />
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
            <FormLabel className="text-white">Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your last name" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Contact Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your last name" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Address</FormLabel>
            <FormControl>
              <Input placeholder="Enter your last name" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
   <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white'>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='text-white'>
                    <SelectValue placeholder="Select your gender"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent >
                  <SelectItem value="male">male</SelectItem>
                  <SelectItem value="female">female</SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectContent>
              </Select>
           
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Skills</FormLabel>
            <FormControl>
              <Input placeholder="Enter your firstname" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
            <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">education</FormLabel>
            <FormControl>
              <Input placeholder="Enter your firstname" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
      <Label htmlFor="picture" className='text-white mb-3 block'>Date of birth</Label>
      <Popover >
  
  <PopoverTrigger asChild>
    <Button
      variant={"outline"}
      className={cn(
        "w-full justify-start text-left font-normal ",
        !dob && "text-muted-foreground"
      )}
    >
       
      <CalendarIcon />
      {dob ? format(dob, "PPP") : <span>Date of Birth</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-full p-0" align="start">
    <Calendar
      mode="single"
      selected={dob}
      onSelect={setdob}
      initialFocus
    />
  </PopoverContent>
</Popover>
      </div>


            <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Experience</FormLabel>
            <FormControl>
              <Input  placeholder="Enter your firstname" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />
            <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">nationality</FormLabel>
            <FormControl>
              <Input  placeholder="Enter your firstname" {...field} className='text-white' />
            </FormControl>
          
            <FormMessage />
          </FormItem>
        )}
      />

<div className="grid w-full text-white items-center gap-1.5">
      <Label htmlFor="picture" className='text-white'>Picture</Label>
      <Input id="picture" type="file" className=' text-white' />
    </div>


   

      <Button type="submit" className='w-full text-xl'>Submit</Button>
    </form>
  </Form>
   </div>
  )
}

export default UserProfileform