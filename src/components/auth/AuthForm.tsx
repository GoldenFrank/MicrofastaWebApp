
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const baseSchema = {
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
};

const loginSchema = z.object(baseSchema);

const signupSchema = z.object({
  ...baseSchema,
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }).max(50, { message: "Full name cannot exceed 50 characters."}),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, signup, loading } = useAuth();
  const router = useRouter();

  const currentSchema = mode === 'login' ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === 'signup' && { fullName: "" }),
    },
  });

  async function onSubmit(values: z.infer<typeof currentSchema>) {
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
      } else if (mode === 'signup') {
        // Type assertion to access fullName safely
        const signupValues = values as z.infer<typeof signupSchema>;
        await signup(signupValues.email, signupValues.password, signupValues.fullName);
      }
      // Redirect is handled by AuthContext or can be forced here if needed
    } catch (error) {
      console.error(`${mode} failed:`, error);
      form.setError("root", { message: (error as Error).message || `Failed to ${mode}. Please try again.` });
    }
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Log in to access your dashboard.' : 'Sign up to start your loan application.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {mode === 'signup' && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Log In' : 'Sign Up'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto text-accent">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto text-accent">
                  <Link href="/login">Log in</Link>
                </Button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
