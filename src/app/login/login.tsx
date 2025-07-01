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
    <div className="grid h-screen grid-cols-1 bg-[#191623] md:grid-cols-2 lg:grid-cols-[2fr_1fr] xl:grid-cols-[2.5fr_1fr]">
      {/* Background Mobile */}
      <div className="mx-auto flex h-full w-[50%] flex-col items-center justify-center md:hidden">
        <Image
          src="/logo-full.svg"
          alt="Imagem do logo"
          layout="responsive"
          width={180}
          height={180}
        />
      </div>

      {/* Background Desktop */}
      <div className="relative hidden h-full flex-col items-center justify-center md:flex">
        <div className="flex w-[clamp(300px,50%,500px)] items-center justify-center">
          <Image
            src="/logo-full.svg"
            alt="Imagem do logo"
            layout="responsive"
            width={180}
            height={180}
          />
        </div>
        <div className="absolute top-0 left-0 w-full opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient
                id="invertedGradient"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="oklch(0.5 0.2 300)" />
                <stop offset="100%" stopColor="oklch(0.7 0.3 320)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#invertedGradient)"
              fillOpacity="1"
              d="M0,128L0,64L75.8,64L75.8,128L151.6,128L151.6,160L227.4,160L227.4,160L303.2,160L303.2,128L378.9,128L378.9,160L454.7,160L454.7,288L530.5,288L530.5,256L606.3,256L606.3,256L682.1,256L682.1,96L757.9,96L757.9,128L833.7,128L833.7,32L909.5,32L909.5,224L985.3,224L985.3,160L1061.1,160L1061.1,256L1136.8,256L1136.8,288L1212.6,288L1212.6,128L1288.4,128L1288.4,224L1364.2,224L1364.2,128L1440,128L1440,0L1364.2,0L1364.2,0L1288.4,0L1288.4,0L1212.6,0L1212.6,0L1136.8,0L1136.8,0L1061.1,0L1061.1,0L985.3,0L985.3,0L909.5,0L909.5,0L833.7,0L833.7,0L757.9,0L757.9,0L682.1,0L682.1,0L606.3,0L606.3,0L530.5,0L530.5,0L454.7,0L454.7,0L378.9,0L378.9,0L303.2,0L303.2,0L227.4,0L227.4,0L151.6,0L151.6,0L75.8,0L75.8,0L0,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.5 0.2 300)" />
                <stop offset="100%" stopColor="oklch(0.7 0.3 320)" />
              </linearGradient>
            </defs>

            <path
              fill="url(#myGradient)"
              d="M0,128L0,64L75.8,64L75.8,128L151.6,128L151.6,160L227.4,160L227.4,160L303.2,160L303.2,128L378.9,128L378.9,160L454.7,160L454.7,288L530.5,288L530.5,256L606.3,256L606.3,256L682.1,256L682.1,96L757.9,96L757.9,128L833.7,128L833.7,32L909.5,32L909.5,224L985.3,224L985.3,160L1061.1,160L1061.1,256L1136.8,256L1136.8,288L1212.6,288L1212.6,128L1288.4,128L1288.4,224L1364.2,224L1364.2,128L1440,128L1440,320L1364.2,320L1364.2,320L1288.4,320L1288.4,320L1212.6,320L1212.6,320L1136.8,320L1136.8,320L1061.1,320L1061.1,320L985.3,320L985.3,320L909.5,320L909.5,320L833.7,320L833.7,320L757.9,320L757.9,320L682.1,320L682.1,320L606.3,320L606.3,320L530.5,320L530.5,320L454.7,320L454.7,320L378.9,320L378.9,320L303.2,320L303.2,320L227.4,320L227.4,320L151.6,320L151.6,320L75.8,320L75.8,320L0,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Login Card */}
      <div className="shadow-brand-indigo flex items-center justify-center border-l bg-[#191623] shadow-xs">
        <div className="w-full max-w-[clamp(300px,50%,500px)] min-w-[300px] self-start md:self-auto">
          <Card className="gradient-border border-none bg-[#383544]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Faça login para continuar ou crie uma conta com o Google.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignInButton>
                <button className="hover:bg-brand-indigo flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-lg border border-white bg-[#191623] p-2 text-white">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
