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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/Ruduxtoolkit/hook";
import { addJob } from "@/Ruduxtoolkit/jobSlice"; // Import jobSlice action
import { toast } from "sonner"; // For toast notifications

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  specification: z.string().min(10, {
    message: "specification must be at least 10 characters long.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters long.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters long.",
  }),
  salaryRange: z.string().optional(), // Optional field
  jobType: z.enum(["full-time", "part-time", "contract", "internship"], {
    message: "Invalid job type selection.",
  }),

  applicationDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Application deadline must be in YYYY-MM-DD format.",
  }),
  isActive: z.boolean(),
});

const JobForm = () => {
  const [postedDate, setPostedDate] = React.useState<Date | undefined>(undefined); // Posted date state
  const [applicationDeadline, setApplicationDeadline] = React.useState<Date | undefined>(undefined); // Application deadline state
  const [isLoading, setIsLoading] = React.useState(false); // Loading state
  const dispatch = useAppDispatch();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      companyName: "",
      location: "",
      salaryRange: "",
      jobType: undefined,
      specification:"",
      applicationDeadline: "",
      isActive: true,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    

      // Dispatch the addJob action
      await dispatch(addJob(values)).unwrap();

      // Show success toast
      toast.success("Job details submitted successfully!");

      // Reset the form
      form.reset();
    } catch (error: any) {
      // Show error toast
      toast.error(error.message || "Failed to submit job details.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-[#5b3e8141] text-white p-6 rounded-lg w-[600px] mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6 items-center"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="specification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specification</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job specification" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Range */}
          <FormField
            control={form.control}
            name="salaryRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="Enter salary range (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Type */}
          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

    

       

       

          {/* Application Deadline */}
          <FormField
            control={form.control}
            name="applicationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal text-black",
                          !applicationDeadline && "text-muted-foreground"
                        )}
                      >
                        {applicationDeadline
                          ? format(applicationDeadline, "PPP")
                          : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={applicationDeadline}
                      onSelect={(date) => {
                        setApplicationDeadline(date);
                        field.onChange(format(date!, "yyyy-MM-dd"));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Active */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between col-span-2">
                <FormLabel>Is Active</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            className="col-span-2 w-full bg-primary hover:bg-primary-dark text-white"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JobForm;