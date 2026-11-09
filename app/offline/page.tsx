"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0] px-5 py-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white/90 p-6 text-center shadow-[0_24px_80px_rgba(200,16,46,0.12)] backdrop-blur-sm sm:p-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C8102E]/10 text-[#C8102E] shadow-inner shadow-[#C8102E]/10">
          <WifiOff size={40} strokeWidth={2.2} />
        </div>

        <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-[#C8102E]">
          Offline Mode
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          You&apos;re offline.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600 sm:text-base">
          Please check your connection to book or view rides.
        </p>

        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-[52px] rounded-full bg-[#C8102E] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#C8102E]/25 transition active:scale-[0.98]"
          >
            Try Again
          </button>
          <div className="rounded-2xl bg-[#F5F4F0] px-4 py-3 text-left text-xs leading-5 text-gray-600">
            <span className="font-bold text-gray-900">Tip:</span> reconnect to
            Wi-Fi or mobile data, then tap Try Again.
          </div>
        </div>
      </div>
    </main>
  );
}
