"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner"; // For toast notifications
import { useAppDispatch } from "@/Ruduxtoolkit/hook";
import { addApplication } from "@/Ruduxtoolkit/applicationSlice"; // Import applicationSlice action

// Define the form schema using Zod
const formSchema = z.object({
  jobId: z.string().min(1, {
    message: "Job ID is required.",
  }),
  candidateId: z.string().min(2, {
    message: "Candidate ID must be at least 2 characters long.",
  }),
  resumeFile: z
    .instanceof(File, {
      message: "A resume file is required.",
    })
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "Resume file size must be less than 5MB.",
    })
    .refine(
      (file) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type),
      {
        message: "Only PDF, DOC, or DOCX files are allowed.",
      }
    ),
  applicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Application date must be in YYYY-MM-DD format.",
  }),
 
});

const ApplicationForm = ({ jobId,userid, onClose }: { jobId: string; userid:string; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobId: jobId, // Pre-fill the job ID
      candidateId: userid,
      resumeFile: undefined,
      applicationDate: new Date().toISOString().split("T")[0], // Today's date
     
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
    

      // Dispatch the addApplication action
      await dispatch(addApplication(values)).unwrap();
      toast.success("Application submitted successfully!");
      onClose(); // Close the modal after submission
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Candidate ID */}
        <FormField
          control={form.control}
          name="candidateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Candidate ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resume File */}
        <FormField
          control={form.control}
          name="resumeFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx" // Restrict to PDF, DOC, and DOCX files
                  onChange={(e) => field.onChange(e.target.files?.[0])} // Handle file selection
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Application Date */}
        <FormField
          control={form.control}
          name="applicationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;