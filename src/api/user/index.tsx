import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

const useSignUp = () => {
  return useMutation<AUTH.SignUpRes, Error, AUTH.SignUpReq>({
    mutationFn: async (data) => {
      const response = await api.post<AUTH.SignUpRes>("/auth/sign-up", data);
      return response.data;
    },
  });
};

const useSignIn = () => {
  return useMutation<AUTH.SignInRes, Error, AUTH.SignInReq>({
    mutationFn: async (data) => {
      const response = await api.post<AUTH.SignInRes>("/auth/sign-in", data);
      return response.data;
    },
  });
};

const useGetMe = () => {
  return useQuery<AUTH.MeRes, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/profile");
      return response.data;
    },
  });
};

export { useSignUp, useSignIn, useGetMe };
