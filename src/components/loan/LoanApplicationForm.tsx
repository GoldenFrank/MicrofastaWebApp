
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// This schema collects all data, some for eligibility, some for MFI matching later
export const loanApplicationFormSchema = z.object({
  logbookDetails: z.string().min(10, "Please provide detailed logbook information (e.g., vehicle make, model, year, registration)."),
  nationalId: z.string().regex(/^\d{7,8}$/, "Enter a valid National ID number (7-8 digits)."),
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least KES 1,000.").max(5000000, "Loan amount cannot exceed KES 5,000,000."),
  monthlyIncome: z.coerce.number().min(1, "Monthly income is required and must be a positive number."),
  mpesaStatement: typeof window !== 'undefined' 
    ? z.instanceof(FileList).refine(files => files?.length === 1, "12-month Mpesa statement is required.") 
    : z.any().refine(value => value !== null && value !== undefined, "12-month Mpesa statement is required."),
  creditScore: z.coerce.number().min(0).max(1000).optional().describe("Optional: 0-1000"),
  employmentStatus: z.enum(["Employed", "Self-Employed", "Unemployed"], { required_error: "Employment status is required." }),
  location: z.string().min(2, "Location (Town/City) is required."),
});

export type LoanApplicationFormValues = z.infer<typeof loanApplicationFormSchema>;

interface LoanApplicationFormProps {
  onSubmit: (data: LoanApplicationFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export default function LoanApplicationForm({ onSubmit, isSubmitting, submitButtonText = "Check Eligibility" }: LoanApplicationFormProps) {
  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationFormSchema),
    defaultValues: {
      logbookDetails: "",
      nationalId: "",
      loanAmount: 10000,
      monthlyIncome: undefined, 
      mpesaStatement: undefined,
      creditScore: undefined,
      employmentStatus: undefined,
      location: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-teal-700">Apply for a Logbook Loan</CardTitle>
        <CardDescription>Fill in your details below to check your loan eligibility and then get matched with MFI institutions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="logbookDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logbook Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Toyota Prado KDA 123X, 2018, Chassis No. XXXXX, Engine No. YYYYY"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide vehicle make, model, year of manufacture, and registration number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12345678" {...field} />
                  </FormControl>
                   <FormDescription>
                    Required for the MFI application stage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount Requested (KES)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Average Monthly Income (KES)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75000" {...field} value={field.value ?? ""} />
                  </FormControl>
                   <FormDescription>
                    Your declared net monthly income.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mpesaStatement"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel>12-Month Mpesa/Bank Statement</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => onChange(e.target.files)}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload your Mpesa or bank statement for the last 12 months (PDF, JPG, PNG). This helps verify income.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="creditScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Score (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 650" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>
                    If known, your credit score (typically 0-1000). Used in MFI matching.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Employed">Employed</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                   <FormDescription>
                    Your current employment situation. Used in MFI matching.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Current Location (Town/City)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Nairobi" {...field} />
                  </FormControl>
                   <FormDescription>
                    Used in MFI matching.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Processing...' : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
