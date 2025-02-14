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
  email: z.string().email({
    message: "Email must be valid.",
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
  const [dob, setDob] = React.useState<Date | undefined>();
  const [isLoading, setIsLoading] = React.useState(false); // Loading state
  const dispatch = useAppDispatch();

  // Initialize form
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
      email: "",
      image: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true); // Start loading
      const formData = new FormData();
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("contact", values.contact);
      formData.append("address", values.address);
      formData.append("gender", values.gender);
      formData.append("education", values.education);
      formData.append("skills", values.skills);
      formData.append("dateofbirth", values.dateofbirth);
      formData.append("experience", values.experience);
      formData.append("nationality", values.nationality);
      formData.append("email", values.email);
      formData.append("image", values.image);

      // Dispatch the addCandidate action
      await dispatch(addCandidate(formData)).unwrap();

      // Show success toast
      toast.success("Profile updated successfully!");

      // Reset the form
      form.reset();
    } catch (error: any) {
      // Show error toast
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-4 bg-[#af8dff48] w-[70%] m-auto rounded-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 items-center gap-5"
        >
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} className="text-white" />
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
                <FormLabel className="text-white">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} className="text-white" />
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
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} className="text-white" />
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
                <FormLabel className="text-white">Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your contact number" {...field} className="text-white" />
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
                <FormLabel className="text-white">Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your address" {...field} className="text-white" />
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
                <FormLabel className="text-white">Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-white">
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
                <FormLabel className="text-white">Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your skills" {...field} className="text-white" />
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
                <FormLabel className="text-white">Education</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your education" {...field} className="text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <div>
            <Label htmlFor="picture" className="text-white mb-3 block">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                  onSelect={setDob}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Experience */}
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Experience</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your experience" {...field} className="text-white" />
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
                <FormLabel className="text-white">Nationality</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your nationality" {...field} className="text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Profile Picture */}
          <div className="grid w-full text-white items-center gap-1.5">
            <Label htmlFor="picture" className="text-white">
              Profile Picture
            </Label>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-xl" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileform;