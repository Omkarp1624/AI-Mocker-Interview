// app/dashboard/page.jsx  ✅ SERVER COMPONENT

import { getAuth } from "@clerk/nextjs/server";
import { headers, cookies } from "next/headers";
import ClientSignIn from "./ClientSignIn";
import Header from "./_components/Header";

export default async function Dashboard() {
  const hdrs = headers();
  const cks = cookies();
  const { userId } = getAuth({ headers: hdrs, cookies: cks });

  if (!userId) {
    // user not logged in → show sign-in UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <ClientSignIn />
        </div>
      </div>
    );
  }

  // user logged in → show dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome to your Dashboard 🎉
        </h1>
        <p className="text-gray-600 mt-2">
          You’re signed in and ready to go!
        </p>
      </main>
    </div>
  );
}
