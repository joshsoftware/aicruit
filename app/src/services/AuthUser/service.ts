import { ApiRoute } from "@/constants/route";
import axiosInstance from "@/services/axios";

export interface PostSignInVariables {
  email: string;
  password: string;
}

export interface PostSignInResponseData {
  success: true;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      role_id: number;
      company_id: number;
      role_name: string;
    };
  };
}

export async function postSignIn(variables: PostSignInVariables) {
  const { email, password } = variables;
  const response = await axiosInstance.post<PostSignInResponseData>(
    ApiRoute.Login,
    {
      user: { email, password },
    }
  );
  return response.data;
}

export interface PostSignUpVariables {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PostSignUpResponseData {
  success: true;
  data: {
    token: string;
    doctor: {
      id: number;
      full_name: string;
      last_name: string;
      email: string;
      role_id: number;
      company_id: number;
      role_name: string;
    };
  };
  message: string;
}

export async function postSignUp(variables: PostSignUpVariables) {
  const { firstName, lastName, email, password } = variables;
  const response = await axiosInstance.post<PostSignUpResponseData>(
    ApiRoute.SignUp,
    {
      user: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      },
    }
  );
  return response.data;
}
