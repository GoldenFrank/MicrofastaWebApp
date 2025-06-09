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
import type { MfiMatchingInput } from "@/ai/flows/mfi-matching";
import { Loader2 } from "lucide-react";

const loanApplicationSchema = z.object({
  logbookDetails: z.string().min(10, "Please provide detailed logbook information."),
  nationalId: z.string().regex(/^\d{7,8}$/, "Enter a valid National ID number (7-8 digits)."),
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least 1000.").max(5000000, "Loan amount cannot exceed 5,000,000."),
  creditScore: z.coerce.number().min(0).max(1000).optional().describe("Optional: 0-1000"),
  employmentStatus: z.enum(["Employed", "Self-Employed", "Unemployed"], { required_error: "Employment status is required." }),
  location: z.string().min(2, "Location is required."),
});

type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;

interface LoanApplicationFormProps {
  onSubmit: (data: MfiMatchingInput) => Promise<void>;
  isSubmitting: boolean;
}

export default function LoanApplicationForm({ onSubmit, isSubmitting }: LoanApplicationFormProps) {
  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      logbookDetails: "",
      nationalId: "",
      loanAmount: 10000,
      creditScore: undefined,
      employmentStatus: undefined,
      location: "",
    },
  });

  const handleFormSubmit = async (values: LoanApplicationFormValues) => {
    const aiInput: MfiMatchingInput = {
      ...values,
      creditScore: values.creditScore ?? 0, // AI model expects number, default to 0 if not provided
    };
    await onSubmit(aiInput);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Apply for a Logbook Loan</CardTitle>
        <CardDescription>Fill in your details below to get matched with MFI institutions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                    Provide comprehensive details of the vehicle logbook you are using as collateral.
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount Requested</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
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
                    <Input type="number" placeholder="e.g., 650" {...field} />
                  </FormControl>
                  <FormDescription>
                    If known, your credit score (typically 0-1000).
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Finding MFIs...' : 'Find Suitable MFIs'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
