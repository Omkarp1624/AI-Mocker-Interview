import React from "react";
import Header from "./_components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16"> {/* space for fixed header */}
        {children}
      </div>
    </div>
  );
}
