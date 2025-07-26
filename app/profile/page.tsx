"use client";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const user = useSelector(selectCurrentUser);

  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {getInitials(user?.name)}
            </span>
          </div>

          {user?.isPremium && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 rounded-full shadow-md">
              <div className="flex items-center">
                <CrownIcon className="w-4 h-4 text-white mr-1" />
                <span className="text-xs font-bold text-white tracking-wide">
                  PREMIUM
                </span>
              </div>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-1">{user?.name}</h1>
        <p className="text-gray-500 flex items-center">
          <EnvelopeIcon className="w-4 h-4 mr-2" />
          {user?.email}
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <UserCircleIcon className="w-5 h-5 mr-2 text-indigo-500" />
          Account Details
        </h2>

        <div className="space-y-4">
          <InfoItem
            label="Account Status"
            value={user?.isPremium ? "Active Premium" : "Free Account"}
            icon={<BadgeCheckIcon className="w-5 h-5 text-green-500" />}
          />

          <InfoItem
            label="Member Since"
            value="Jan 15, 2023"
            icon={<CalendarIcon className="w-5 h-5 text-blue-500" />}
          />

          <InfoItem
            label="Subscription"
            value={user?.isPremium ? "Annual (renews Dec 2023)" : "Basic"}
            icon={<CreditCardIcon className="w-5 h-5 text-purple-500" />}
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5">
          Edit Profile
        </button>
        {!user?.isPremium && (
          <button className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-medium transition duration-200 shadow hover:shadow-md">
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
};

// Reusable info component
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="bg-white p-2 rounded-lg shadow-sm mr-3">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

// SVG Icons (remain unchanged)
const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1.323l3.954.784a1 1 0 01.596 1.577l-1.83 2.087 1.147 4.026a1 1 0 01-1.694.949L10 10.147l-3.172 2.502a1 1 0 01-1.694-.949l1.147-4.026-1.83-2.087a1 1 0 01.596-1.577L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.87a1 1 0 001.68.988L10 12.28l3.138 2.852a1 1 0 001.68-.988L14 10.274l-1.39-1.587a1 1 0 00-.728-.345l-3.065.607-3.065-.607a1 1 0 00-.728.345L5 10.274z"
      clipRule="evenodd"
    />
  </svg>
);

const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BadgeCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

export default Page;
