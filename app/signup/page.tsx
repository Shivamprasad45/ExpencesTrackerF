"use client";
// pages/signup.tsx
import { useState } from "react";
// import { useRouter } from "next/router";
// import { useSignupMutation } from "@/lib/features/auth/Auth";
import FormInput from "../components/FormInput";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/lib/features/auth/Auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { data: AuthData, isLoading, error }] = useRegisterMutation();
  const router = useRouter();

  if (AuthData) {
    console.log(AuthData, "sdsd");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ name, email, password }).unwrap();
      router.push("/login?signupSuccess=true");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      suppressHydrationWarning
    >
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <FormInput
              label="Full Name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {/* @ts-ignore */}
              {error.data?.message || "Signup failed"}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
