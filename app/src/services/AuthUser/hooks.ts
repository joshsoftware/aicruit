"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SigninUserRequest, SignupUserRequest } from "@/validators/register";
import { useState } from "react";
import { ValidationMessage } from "@/constants/messages";
import { handleErrorResponse } from "../axios";
import { BrowserRoute } from "@/constants/route";
import { UserRoutes } from "../userTypes";
import { postSignIn, postSignUp } from "./service";

export const useUser = () => {
  const router = useRouter();

  const [disableSubmit, setDisableSubmit] = useState(false);
  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationKey: ["signup"],
    mutationFn: postSignUp,
    onSuccess: async () => {
      toast.success(ValidationMessage.SIGNUP_SUCCESS);
      router.push(BrowserRoute.SignIn);
    },
    onError: (error) => handleErrorResponse(error),
    onSettled: () => {
      setDisableSubmit(false);
    },
  });

  const { mutate: signin, isPending: isSigningIn } = useMutation({
    mutationKey: ["signin"],
    mutationFn: postSignIn,
    onSuccess: async (res) => {
      toast.success(ValidationMessage.SIGNIN_SUCCESS);
      // User role based navigation
      const userRole = res?.data?.user.role_name;
      router.push(UserRoutes[userRole]);
    },
    onError: (error) => handleErrorResponse(error),

    onSettled: () => {
      setDisableSubmit(false);
    },
  });

  const signupUser = (data: SignupUserRequest) => {
    setDisableSubmit(true);
    signup(data);
  };

  const signinUser = (data: SigninUserRequest) => {
    setDisableSubmit(true);
    signin(data);
  };

  return {
    signupUser,
    signinUser,
    isPending: isSigningUp || isSigningIn,
    disableSubmit,
  };
};
