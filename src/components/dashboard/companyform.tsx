"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner"; // For toast notifications
import { useAppDispatch } from "@/Ruduxtoolkit/hook";
import { addCompany, fetchCompanies } from "@/Ruduxtoolkit/companySlice";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  description: z.string().optional(), // Optional field
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters long.",
  }),
  website: z.string().url({
    message: "Website must be a valid URL.",
  }).optional(), // Optional field
  logoUrl: z.instanceof(File).optional().refine(
    (file) => !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    { message: "Only JPEG, PNG, or JPG images are allowed." }
  ), // Validate file type
});

const CompanyForm = () => {
  const [isLoading, setIsLoading] = React.useState(false); // Loading state
const dispatch = useAppDispatch()

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      industry: "",
      website: "",
      logoUrl: undefined, // Default value for file input   
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Start loading
    try {
      const companyData:any = {
        name: values.name,
        description: values.description,
        industry: values.industry,
        website: values.website,
        logoUrl: values.logoUrl || undefined, // Pass the File object here
      };
      const res = await    dispatch(addCompany(companyData))
      console.log(res)
      dispatch(fetchCompanies());

      // Show success toast
      toast.success("Company details submitted successfully!");

      // Reset the form
      form.reset();

    } catch (error: any) {
      // Show error toast
      toast.error(error.message || "Failed to submit company details.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-[#5b3e8141] text-white p-6 rounded-lg w-[550px] mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6 items-center"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
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
                  <Input placeholder="Enter company description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry */}
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Enter industry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo URL (File Input) */}
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      onChange(file); // Update the form value with the selected file
                    }}
                    {...fieldProps}
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

export default CompanyForm;