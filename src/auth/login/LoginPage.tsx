"use client";

import { useLogin, useRegister } from "@/api/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import scss from "./LoginPage.module.scss";
import SignInWithGoogle from "../SignInWuthGoogle";

type LoginInputs = { email: string; password: string };
type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  adminKey?: string;
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { mutateAsync: loginAsync, isPending: loginLoading } = useLogin();
  const { mutateAsync: registerAsync, isPending: registerLoading } =
    useRegister();

  const loginForm = useForm<LoginInputs>();
  const registerForm = useForm<RegisterInputs>();

  const handleLogin: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await loginAsync(data);
      localStorage.setItem("token", res.token);
      alert(`Вход успешен! Привет, ${res.user.name}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка входа");
    }
  };

  const handleRegister: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      const res = await registerAsync(data);
      localStorage.setItem("token", res.token);
      alert(`Регистрация успешна! Добро пожаловать, ${res.user.name}`);
      setIsLogin(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className={scss.container}>
      <div className={scss.toggle}>
        <button
          className={isLogin ? scss.active : ""}
          onClick={() => setIsLogin(true)}
        >
          Войти
        </button>
        <button
          className={!isLogin ? scss.active : ""}
          onClick={() => setIsLogin(false)}
        >
          Регистрация
        </button>
      </div>

      {isLogin ? (
        <>
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className={scss.form}
          >
            <input
              {...loginForm.register("email", { required: "Email обязателен" })}
              placeholder="Email"
            />
            {loginForm.formState.errors.email && (
              <span className={scss.error}>
                {loginForm.formState.errors.email.message}
              </span>
            )}

            <input
              type="password"
              {...loginForm.register("password", {
                required: "Пароль обязателен",
              })}
              placeholder="Пароль"
            />
            {loginForm.formState.errors.password && (
              <span className={scss.error}>
                {loginForm.formState.errors.password.message}
              </span>
            )}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Входим..." : "Войти"}
            </button>
          </form>

          <div className={scss.googleWrapper}>
            <SignInWithGoogle />
          </div>
        </>
      ) : (
        <form
          onSubmit={registerForm.handleSubmit(handleRegister)}
          className={scss.form}
        >
          <input
            {...registerForm.register("name", { required: "Имя обязательно" })}
            placeholder="Имя"
          />
          {registerForm.formState.errors.name && (
            <span className={scss.error}>
              {registerForm.formState.errors.name.message}
            </span>
          )}

          <input
            {...registerForm.register("email", {
              required: "Email обязателен",
            })}
            placeholder="Email"
          />
          {registerForm.formState.errors.email && (
            <span className={scss.error}>
              {registerForm.formState.errors.email.message}
            </span>
          )}

          <input
            type="password"
            {...registerForm.register("password", {
              required: "Пароль обязателен",
            })}
            placeholder="Пароль"
          />
          {registerForm.formState.errors.password && (
            <span className={scss.error}>
              {registerForm.formState.errors.password.message}
            </span>
          )}

          <input
            {...registerForm.register("adminKey")}
            placeholder="Ключ администратора (необязательно)"
          />

          <button type="submit" disabled={registerLoading}>
            {registerLoading ? "Регистрируем..." : "Зарегистрироваться"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
