"use client";

interface UserFormProps {
  formType: "signup" | "signin";
}

import { useState } from "react";
import "../app/globals.css";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";

interface UserFormProps {
  formType: "signup" | "signin";
}

const UserForm = (props: UserFormProps) => {
  const { formType } = props;

  const isSignup = formType === "signup";

  const [formData, setFormData] = useState({
    name: "",
    officeEmail: "",
    mobile: "",
    designation: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-full justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 justify-center items-center"
        style={{ fontSize: "14px" }}
      >
        <h1 className="text-3xl font-bold mt-4">
          {isSignup ? "Sign Up" : "Sign In"}
        </h1>

        {isSignup ? (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="officeEmail">Office Email</label>
              <input
                type="email"
                name="officeEmail"
                value={formData.officeEmail}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="mobile">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="designation">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 border rounded-md"
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="bg-[#3F37C9] hover:bg-[#668D7E] text-white w-full"
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <div>
        <div className="flex flex-col text-sm gap-1 justify-center items-center">
          <Link
            href={isSignup ? "/signin" : "/signup"}
            className={cn(
              buttonVariants({
                variant: "link",
                className: "text-[#668D7E] hover:text-[#668D7E] font-bold",
              }),
            )}
          >
            {isSignup
              ? "Already have an Acount? Sign In"
              : "Don't have an Account ? Sign Up "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
