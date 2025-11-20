import { UserButton } from '@clerk/nextjs';
import React from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';

function Dashboard() {
  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl text-primary">Dashboard</h2>
        <UserButton />
      </div>

      <p className="text-gray-500 mt-2">
        Create and start your AI-powered mock interview
      </p>

      {/* Add New Interview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 my-5 gap-5">
        <AddNewInterview />
      </div>

      {/* Previous Interviews List */}
      <InterviewList />
    </div>
  );
}

export default Dashboard;
