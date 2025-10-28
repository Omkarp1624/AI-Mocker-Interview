"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"     // 👈 redirect after sign in
        afterSignInUrl="/dashboard"  // 👈 ensure consistent redirect
      />
    </div>
  );
}
