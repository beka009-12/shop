import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const Logaut = () => {
  const quryClient = useQueryClient();
  return useMutation<AUTH.LogoutRes, Error, AUTH.LogoutReq>({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      quryClient.removeQueries({ queryKey: ["me"] });
      quryClient.clear();
    },
  });
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<AUTH.UpdateProfileRes, Error, AUTH.UpdateProfileReq>({
    mutationFn: async (data) => {
      const response = await api.put("/auth/profile-update", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export { useSignUp, useSignIn, useGetMe, Logaut, useUpdateProfile };
