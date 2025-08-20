"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignInWithGoogle = () => {
  const router = useRouter();
  const handleLogin = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/v1/auth/googleAuth`,
        { token },

        { withCredentials: true }
      );
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => console.log("Ошибка Google Sign-In")}
    />
  );
};

export default SignInWithGoogle;
