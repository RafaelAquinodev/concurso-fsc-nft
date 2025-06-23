"use client";

import { NFT } from "@/types/nfts-types";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AcquirePlanButton from "./acquire-plan-button";

const UpgradePlan = () => {
  return (
    <div className="flex gap-12">
      <div className="overflow-hidden rounded-xl bg-neutral-900">
        <div className="p-4">
          <div className="mb-2 flex flex-col items-center pt-4">
            <h2 className="truncate text-lg font-bold text-gray-100">Basic</h2>
            <h2 className="truncate text-3xl font-bold text-gray-100">FREE</h2>
          </div>

          <div className="flex gap-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-green-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p>Monitoramento e análise de carteiras</p>
          </div>

          <div className="flex gap-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-green-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p>Carteiras ilimitadas</p>
          </div>

          <div className="flex gap-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <p>Favoritos</p>
          </div>
          <div className="flex justify-center p-8">
            <button
              disabled
              className="rounded-xl bg-purple-600 from-purple-600 to-blue-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Plano ativo
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl bg-neutral-900 shadow-[0_5px_0_0_#b22ecd] transition-all duration-300 hover:scale-102 hover:shadow-[0_0px_5px_0_#b22ecd]">
        <div className="p-4">
          <div className="mb-2 flex flex-col items-center pt-4">
            <h2 className="truncate text-lg font-bold text-gray-100">
              Premium
            </h2>
            <h2 className="truncate text-3xl font-bold text-purple-500">
              R$19,99
            </h2>
          </div>

          <div className="flex gap-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-green-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p>Monitoramento e análise de carteiras</p>
          </div>

          <div className="flex gap-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-green-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p>Carteiras ilimitadas</p>
          </div>

          <div className="flex gap-2 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-green-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p>Favoritos</p>
          </div>
          <div className="flex justify-center p-8">
            <AcquirePlanButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
