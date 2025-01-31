import { useState } from "react";
import api from "@/lib/apis/api"; // Import the api instance

interface LoginData {
  email: string;
  password: string;
  auth_field?: "email" | "phone";
  phone?: string | null;
  phone_country?: string | null;
  captcha_key?: string;
}
interface User {
  id: number;
  name: string;
  username: string;
  country_code: string;
  language_code: string;
  user_type_id: number | null;
  gender_id: number;
  photo?: any;
  about?: string | null;
  auth_field: "email" | "phone" | "string";
  email?: string;
  phone: string;
  phone_national: string;
  phone_country: string;
  phone_hidden: boolean;
  disable_comments?: boolean;
  ip_addr?: string;
  provider: string;
  provider_id: string;
  email_token: string | null;
  phone_token: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  accept_terms: boolean;
  accept_marketing_offers: boolean;
  time_zone: string | null;
  blocked: boolean;
  closed: boolean;
  last_activity: string | null;
  phone_intl: string;
  updated_at: string | null;
  original_updated_at: string | null;
  original_last_activity: string | null;
  created_at_formatted: string | null;
  photo_url?: string | null;
  p_is_online?: boolean;
  country_flag_url?: string | null;
}

interface Extra {
  authToken: string;
  tokenType: "Bearer" | string;
  isAdmin: boolean;
  sendEmailVerification: {
    emailVerificationSent: boolean;
    message: string;
    success: boolean;
  };
}

interface ForgotPasswordData {
  email: string;
  auth_field?: string;
  phone?: string | null;
  phone_country?: string | null;
  captcha_key?: string;
}

interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
  phone_country: string | null;
  auth_field: string;
  phone: string | null;
  captcha_key: string;
}

export const useFetchAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [response, setResponse] = useState<User | boolean | null>(null);
  const [extra, setExtra] = useState<Extra | null>(null);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.post("/api/auth/login", data); // Use api instance
      const { success, message, result, extra } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setExtra(extra);
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: User) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: responseData } = await api.post("/api/users", data); // Use api instance
      const { success, message, result, extra } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setExtra(extra);
        // setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      console.log("err", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (userId: number, data: User) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.put(
        `/api/users/${userId}`,
        data
      ); // Use api instance
      const { success, message, result, extra } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      console.log("err", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAccount = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.delete(`/api/users/${userId}`); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      console.log("err", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async (userId: number, data: any) => {
    try {
      setIsLoading(true);
      setUploadError(null);

      const { data: responseData } = await api.put(
        `/api/users/${userId}`,
        data
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setUploadError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      console.log("err", err.response);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.post(
        "/api/auth/password/email",
        data
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(true); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordToken = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.post(
        "/api/auth/password/token",
        { code }
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.post(
        "/api/auth/password/reset",
        data
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmailLink = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.get(
        `/api/password/${id}/verify/resend/email`,
        { params: { entitySlug: "users" } }
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendSmsCode = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.get(
        `/api/password/${id}/verify/resend/sms`,
        { params: { entitySlug: "users" } }
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (field: string, token?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: responseData } = await api.get(
        `/api/password/verify/${field}/${token ? token : ""}`,
        { params: { entitySlug: "users" } }
      ); // Use api instance
      const { success, message, result } = responseData;

      if (!success) {
        setError(message); // If the request failed, set the error message
      } else {
        setResponse(result); // Set the response if success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    uploadError,
    response,
    extra,
    login,
    register,
    update,
    closeAccount,
    uploadPhoto,
    forgotPassword,
    resetPasswordToken,
    resetPassword,
    resendEmailLink,
    resendSmsCode,
    verify,
  };
};

export { ForgotPasswordData, User, LoginData };
