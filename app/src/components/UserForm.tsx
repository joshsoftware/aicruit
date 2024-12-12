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
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  SignupUserRequest,
  signupUserSchema,
  SigninUserRequest,
  signinUserSchema
} from "@/Validators/register";
import Link from "next/link";

interface UserFormProps {
  formType: "signin" | "signup";
}

const UserForm = (props: UserFormProps) => {
  const { formType } = props;

  const isSignup = formType === "signup";
  const form = useForm<SignupUserRequest | SigninUserRequest>({
    resolver: zodResolver(isSignup ? signupUserSchema : signinUserSchema),
    defaultValues: isSignup
      ? {
          name: "",
          officeEmail: "",
          mobile: "",
          designation: "",
          password: "",
          confirmPassword: ""
        }
      : { officeEmail: "", password: "" },
    mode: "all"
  });

  const onSubmit = (data: SignupUserRequest | SigninUserRequest) => {
    // submit data to the server
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm flex flex-col gap-2 justify-center items-center"
        >
          <h1 className="text-3xl font-bold mt-4">
            {isSignup ? "Sign Up" : "Sign In"}
          </h1>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <FormField
              control={form.control}
              name="officeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your Office Email"
                      className="p-1 text-xs h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isSignup && (
            <>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your Name"
                          className="p-1 text-xs h-8"
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
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your Mobile Number"
                          className="p-1 text-xs h-8"
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
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your Designation"
                          className="p-1 text-xs h-8"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your Password"
                      className="p-1 text-xs h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isSignup && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your Password"
                        className="p-1 text-xs h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button
            type="submit"
            className="bg-[#668D7E] hover:bg-[#668D7E] text-white w-full"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col text-sm gap-1 justify-center items-center">
        <Link
          href={isSignup ? "/signin" : "/signup"}
          className={cn(
            buttonVariants({
              variant: "link",
              className: "text-[#668D7E] hover:text-[#668D7E] font-bold"
            })
          )}
        >
          {isSignup
            ? "Already have an Account? Sign In"
            : "Don't have an Account? Sign Up"}
        </Link>
      </div>
    </div>
  );
};

export default UserForm;
