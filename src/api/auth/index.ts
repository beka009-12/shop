import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: AUTH.RegisterReq) => {
      const response = await api.post<AUTH.RegisterRes>("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      console.error(
        "Ошибка регистрации:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export { useLogin, useRegister };
