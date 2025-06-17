"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export const Login = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (isSignedIn) return null;

  return (
    <div className="flex h-screen">
      <div className="flex h-full w-[70%] items-center justify-center bg-[linear-gradient(to_bottom,rgba(123,62,141,1),rgba(34,17,39,1))]">
        <Image src="/logo.svg" alt="Imagem do logo" width={160} height={160} />
      </div>
      <div className="flex w-[30%] items-center justify-center bg-[rgba(34,17,39,1)]">
        <div className="h-[400px] w-[400px]">
          <div className="rounded-xl bg-pink-500 p-[4px]">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Faça Login para continuar ou crie uma conta com google.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <SignInButton>
                    <button className="flex h-[35px] w-full items-center justify-center gap-x-2 rounded-lg border border-white text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Entrar com Google
                    </button>
                  </SignInButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
