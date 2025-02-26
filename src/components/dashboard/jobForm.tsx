"use client";
import React, { useState } from "react";
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
import { addJob } from "@/Ruduxtoolkit/jobSlice";
import { toast } from "sonner";
import Textedito from "./TextEditor";

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long." }),
  
  category: z.string().min(2, { message: "Category must be at least 2 characters long." }),
  totalvacancy: z.string().min(1, { message: "Total vacancy at least 1." }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters long." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters long." }),
  salaryRange: z.string().optional(),
  jobType: z.enum(["full-time", "part-time", "contract", "internship"]),
  applicationDeadline: z.date({ message: "Application deadline must be a valid date." }),
  isActive: z.boolean(),
});

const JobForm = () => {
  const [applicationDeadline, setApplicationDeadline] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      
      companyName: "",
      location: "",
      salaryRange: "",
      jobType: undefined,
      category: "",
      totalvacancy: 1,
      applicationDeadline: undefined,
      isActive: true,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Attach content from Text Editor to description
      // values.description: = content;

      await dispatch(addJob({...values,description:content})).unwrap();
      toast.success("Job details submitted successfully!");
      form.reset();
      setContent(""); // Reset text editor
    } catch (error: any) {
      toast.error(error.message || "Failed to submit job details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#5b3e8141] text-white p-6 rounded-lg w-full md:w-[80%] mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 items-center">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="Enter job title" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="col-span-2 w-full">
            <Textedito content={content} setContent={setContent} />
          </div>

          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Enter company name" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="Enter location" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="salaryRange" render={({ field }) => (
            <FormItem><FormLabel>Salary Range</FormLabel><FormControl><Input placeholder="Enter salary range (optional)" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="totalvacancy" render={({ field }) => (
            <FormItem><FormLabel>Total Vacancy</FormLabel><FormControl><Input type="number" placeholder="Enter total vacancy" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="Enter category" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="jobType" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="applicationDeadline" render={({ field }) => (
            <FormItem>
              <FormLabel>Application Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full pl-3 text-left font-normal text-black">
                      {applicationDeadline ? format(applicationDeadline, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={applicationDeadline} onSelect={(date) => {
                    setApplicationDeadline(date);
                    field.onChange(date);
                  }} />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          <Button className="col-span-2 w-full bg-primary text-white" type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JobForm;
