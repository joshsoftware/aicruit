"use client";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  SignupUserRequest,
  signupUserSchema,
  SigninUserRequest,
  signinUserSchema,
} from "@/validators/register";

import { useUser } from "@/services/AuthUser/hooks";
import Link from "next/link";

interface UserFormProps {
  formType: "signin" | "signup";
}

const UserForm = (props: UserFormProps) => {
  const { formType } = props;

  const { disableSubmit, isPending, signupUser, signinUser } = useUser();
  const isSignup = formType === "signup";
  const form = useForm<SignupUserRequest | SigninUserRequest>({
    resolver: zodResolver(isSignup ? signupUserSchema : signinUserSchema),
    defaultValues: isSignup
      ? { firstName: "", lastName: "", email: "", password: "" }
      : { email: "", password: "" },
    mode: "all",
  });

  const onSubmit = (data: SignupUserRequest | SigninUserRequest) =>
    isSignup
      ? signupUser(data as SignupUserRequest)
      : signinUser(data as SigninUserRequest);

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm flex flex-col gap-6 justify-center items-center"
        >
          <h1 className="text-3xl font-bold">
            {isSignup ? "Sign Up" : "Sign In"}
          </h1>
          {isSignup && (
            <>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>first name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>last name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="contact"
                          placeholder="Enter last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            isLoading={disableSubmit || isPending}
            disabled={disableSubmit || isPending}
            type="submit"
            className="!bg-[#3F37C9] text-white w-full"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </Form>
      <div>
        <div className="flex flex-col text-sm gap-1 justify-center items-center">
          <Link
            href={isSignup ? "/signin" : "/signup"}
            aria-disabled={disableSubmit || isPending}
            className={cn(
              disableSubmit || isPending ? "pointer-events-none" : "",
              buttonVariants({
                variant: "link",
                className: "font-bold",
              })
            )}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
