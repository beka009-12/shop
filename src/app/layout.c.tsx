"use client";
import { ReactQueryProvider } from "@/provider/Provider";
import { ReactNode, FC } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface ILay {
  children: ReactNode;
}

const LayoutClient: FC<ILay> = ({ children }) => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </GoogleOAuthProvider>
  );
};

export default LayoutClient;
