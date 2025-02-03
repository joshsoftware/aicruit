"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SigninUserRequest, SignupUserRequest } from "@/validators/register";
import { useState } from "react";
import { ValidationMessage } from "@/constants/messages";
import { BrowserRoute } from "@/constants/route";
import { postSignIn, postSignUp } from "./api";
import { UserRoutes } from "@/constants/constants";
import { handleErrorResponse } from "@/utils/axios";
import LocalStorage from "@/utils/localStore";
import { loadAuth } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export const useUser = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      const responseData = res.data;

      const transformedUserData = {
        id: responseData.user.id,
        firstName: responseData.user.first_name,
        lastName: responseData.user.last_name,
        email: responseData.user.email,
        roleId: responseData.user.role_id,
        comapanyId: responseData.user.company_id,
        roleName: responseData.user.role_name,
      };

      LocalStorage.setItem(
        LocalStorage.AUTH_USER_DATA,
        JSON.stringify({ token: responseData.token, user: transformedUserData })
      );

      dispatch(
        loadAuth({
          token: responseData.token,
          user: transformedUserData,
        })
      );

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
