"use client";
import Header from "./dashboard/_components/Header";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Welcome, {user?.firstName || "User"} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          You are successfully signed in to <span className="font-medium">AI Interview Mocker</span>.
        </p>

        <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
          <p className="text-gray-700">
            This is your personalized dashboard. You can start exploring the features soon!
          </p>
        </div>
      </main>
    </div>
  );
}
