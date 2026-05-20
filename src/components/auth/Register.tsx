"use client";
import { type FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  usePostAuthSignUp,
  usePostAuthSignIn,
  usePostAuthGoogleBuyer,
} from "@/api/generated/endpoints/auth/auth";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import scss from "./Register.module.scss";

const Auth: FC = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode === "login");

  const { mutateAsync: signUpMutate } = usePostAuthSignUp();
  const { mutateAsync: signInMutate } = usePostAuthSignIn();
  const { mutateAsync: googleMutate } = usePostAuthGoogleBuyer();
  const router = useRouter();

  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const response = await googleMutate({
        data: { idToken: credentialResponse.credential },
      });
      const token = response?.token;
      if (token) localStorage.setItem("token", token);
      toast.success("Вход через Google выполнен!");
      router.push("/");
    } catch {
      toast.error("Ошибка входа через Google");
    }
  };

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUp,
  } = useForm<{ email: string; password: string; name: string }>();

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    reset: resetSignIn,
  } = useForm<{ email: string; password: string }>();

  const onRegister: SubmitHandler<{
    email: string;
    password: string;
    name: string;
  }> = async (formData) => {
    try {
      const response = await signUpMutate({
        data: { ...formData, phone: "" },
      });
      resetSignUp();
      toast.success("Регистрация успешна!");
      if (response.token) localStorage.setItem("token", response.token);
      router.push("/");
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      toast.error("Не удалось зарегистрироваться. Попробуйте снова.");
    }
  };

  const onLogin: SubmitHandler<{ email: string; password: string }> = async (
    formData,
  ) => {
    try {
      const response = await signInMutate({ data: formData });
      resetSignIn();
      toast.success("Вход выполнен!");
      const token = response.result?.token;
      if (token) localStorage.setItem("token", token);
      router.push("/");
    } catch (error: any) {
      console.error("Ошибка входа:", error);
      toast.error("Не удалось войти. Проверьте email и пароль.");
    }
  };

  return (
    <section className={scss.Auth}>
      <div className="container">
        <div className={scss.content}>
          {isLogin ? (
            <div className={scss.loginBox}>
              <h1 className={scss.h1}>С возвращением!</h1>
              <p className={scss.subtitle}>
                Войдите в аккаунт, чтобы продолжить работу
              </p>

              <form
                className={scss.form}
                onSubmit={handleSubmitSignIn(onLogin)}
              >
                <input
                  className={scss.inputs}
                  {...registerSignIn("email")}
                  type="email"
                  placeholder="Email"
                />
                <input
                  className={scss.inputs}
                  {...registerSignIn("password")}
                  type="password"
                  placeholder="Пароль"
                  minLength={6}
                />
                <button
                  className={scss.button}
                  type="submit"
                  aria-label="Войти"
                >
                  Войти
                </button>
              </form>

              <div className={scss.divider}>
                <span>или</span>
              </div>

              <div className={scss.googleWrap}>
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={() => toast.error("Ошибка входа через Google")}
                  width="100%"
                  text="signin_with"
                />
              </div>

              <p
                onClick={() => setIsLogin(false)}
                className={scss.registerLink}
              >
                Нет аккаунта? <span>Создать</span>
              </p>
            </div>
          ) : (
            <>
              <h1 className={scss.h1}>Добро пожаловать!</h1>
              <p className={scss.subtitle}>
                Создайте аккаунт, чтобы начать пользоваться сервисом
              </p>

              <form
                className={scss.form}
                onSubmit={handleSubmitSignUp(onRegister)}
              >
                <input
                  className={scss.inputs}
                  {...registerSignUp("email")}
                  type="email"
                  placeholder="Email"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("password")}
                  minLength={6}
                  type="password"
                  placeholder="Пароль"
                />
                <input
                  className={scss.inputs}
                  {...registerSignUp("name")}
                  type="text"
                  placeholder="Ваше имя"
                />
                <button
                  className={scss.button}
                  type="submit"
                  aria-label="Зарегистрироваться"
                >
                  Зарегистрироваться
                </button>
              </form>

              <div className={scss.divider}>
                <span>или</span>
              </div>

              <div className={scss.googleWrap}>
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={() => toast.error("Ошибка входа через Google")}
                  width="100%"
                  text="signup_with"
                />
              </div>

              <p className={scss.registerLink} onClick={() => setIsLogin(true)}>
                Уже есть аккаунт? <span>Войти</span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
