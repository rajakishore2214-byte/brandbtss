"use client";

import React, { useState, useEffect, useActionState, Suspense } from "react";
import { Lock, User, Eye, EyeOff, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { adminLogin } from "@/app/admin/actions";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/admin";

  // Loading Splash Screen state
  const [splashLoading, setSplashLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // useActionState for form handling (Server Action)
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await adminLogin(prevState, formData);
      if (res.success) {
        // Redirect on success
        router.refresh();
        router.push(redirectPath);
      } else {
        // Trigger card shake animation on error
        setShake(true);
      }
      return res;
    },
    { success: false, error: null }
  );

  // Clear shake state after animation ends
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  // Handle splash loading screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans w-full">
      {/* Custom Keyframe Animations CSS */}
      <style jsx global>{`
        @keyframes float-bubble {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes gradient-breath {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.55; }
        }
        @keyframes ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes form-slide-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0px) scale(1); filter: blur(0px); }
        }
        @keyframes shake-card {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        @keyframes text-fade {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float-bubble 4s ease-in-out infinite;
        }
        .animate-breath-1 {
          animation: gradient-breath 8s ease-in-out infinite;
        }
        .animate-breath-2 {
          animation: gradient-breath 10s ease-in-out infinite 2s;
        }
        .animate-ring-spin {
          animation: ring-spin 2s linear infinite;
        }
        .animate-form-in {
          animation: form-slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake-card 0.5s ease-in-out;
        }
        .animate-text-reveal {
          animation: text-fade 0.5s ease-out forwards;
        }
      `}</style>

      {/* Decorative animated background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] animate-breath-1 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/5 blur-[120px] animate-breath-2 pointer-events-none" />

      {splashLoading ? (
        /* 1. BRANDBTSS PREMIUM LOADING THEME SCREEN */
        <div className="flex flex-col items-center justify-center space-y-6 z-10">
          <div className="relative flex items-center justify-center h-28 w-28">
            {/* Spinning Loader Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-800 border-t-primary animate-ring-spin shadow-lg shadow-primary/20" />
            
            {/* Centered Pulsing Logo */}
            <div className="relative h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center p-2 animate-float">
              <img
                src="/logo.png"
                alt="BrandBTSS"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h2 className="font-display text-2xl font-black tracking-tight text-white animate-text-reveal">
              brand<span className="text-primary">btss</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono tracking-widest uppercase animate-text-reveal [animation-delay:200ms]">
              Establishing Secure Tunnel...
            </p>
          </div>
        </div>
      ) : (
        /* 2. GLOWING ADMIN LOGIN PANEL FORM */
        <div className="w-full max-w-md px-4 z-10">
          <div
            className={`w-full rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/80 animate-form-in ${
              shake ? "animate-shake border-red-500/40" : ""
            }`}
          >
            {/* Panel Header */}
            <div className="flex flex-col items-center text-center space-y-3 mb-8">
              <div className="h-16 w-16 rounded-full bg-slate-955 border border-slate-800 flex items-center justify-center p-1.5 shadow-inner hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="BrandBTSS"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div>
                <h1 className="font-display text-xl font-black text-white">Admin Terminal</h1>
                <p className="text-xs text-slate-400 mt-1">Authorized access credentials required</p>
              </div>
            </div>

            {/* Error Message Alert */}
            {state.error && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5 mb-6 flex items-start gap-2.5 text-red-400 animate-text-reveal">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block">Access Denied</span>
                  <span className="text-[10px] text-red-300 leading-relaxed block">{state.error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block"
                >
                  Admin Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Enter admin name"
                    autoComplete="username"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800/80 focus:border-primary px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:shadow-md focus:shadow-primary/5 transition-all text-slate-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block"
                  >
                    Authorization Token
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800/80 focus:border-primary px-4 py-3 pl-10 pr-10 text-sm text-white focus:outline-none focus:shadow-md focus:shadow-primary/5 transition-all text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="relative w-full rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] py-3 text-center text-sm font-black text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Verifying Authority...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5" />
                      <span>Authenticate Terminal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans w-full">
          <div className="flex flex-col items-center justify-center space-y-6 z-10">
            <div className="relative flex items-center justify-center h-28 w-28">
              <div className="absolute inset-0 rounded-full border-[3px] border-slate-800 border-t-primary animate-spin" />
              <div className="relative h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
                <img
                  src="/logo.png"
                  alt="BrandBTSS"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h2 className="font-display text-2xl font-black tracking-tight text-white">
                brand<span className="text-primary">btss</span>
              </h2>
            </div>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
