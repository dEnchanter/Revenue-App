import axios from '@/util/axios';
import { Endpoint } from '@/util/constants';
import useSWR from 'swr';
import { useRouter } from "next/router";
import { useEffect } from 'react';

export function useUser({ redirectTo = false, redirectIfFound = false } = {}) {
  async function userFetcher(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error?.response?.data) {
        return error.response.data;
      }
      if (error.userNotFound) {
        throw error;
      }
      // TODO If the error is not associated with get user request, handle here
      throw error;
    }
  }

  const { data: user, mutate: mutateUser, ...rest } = useSWR(
    Endpoint.USER,
    userFetcher
  );

  const router = useRouter();

  useEffect(() => {
    if (!redirectTo || !user) return; 

    if (
      // Redirect to login if user is not found and we are not on the login page
      (redirectTo && !redirectIfFound && !user?.data?.code == "00") ||
      // Redirect to appropriate page if this is the login page and we found a user
      (redirectIfFound && user?.data?.code == "00")
    ) {
      router.push(redirectTo);
    }
  }, [user, redirectTo, redirectIfFound]);

  return { user, mutateUser, ...rest };
}

export async function doLoginSender(body) {
  try {
    let response = await axios.post(Endpoint.LOGIN, body)
    let payload = response.data;

    if (payload.code === "00") {
      localStorage.setItem("token", payload.data.authToken);
      return payload;
    }

    let message =
      payload.code === 99
        ? "Username or password is incorrect"
        : "Authentication service could not complete your " +
          "request at the moment. Please retry or contact support";
          
    const error = new Error(message);
    error.fromLogin = true;
    throw error;

  } catch (error) {
    if (error.fromLogin) {
      throw error;
    }

    console.error(error);
    error.fromLogin = true;
    error.message = "Something went wrong. Please refresh page and try again";
    throw error;
  }
}