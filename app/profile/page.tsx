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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">
                  {getInitials(user?.name)}
                </span>
              </div>
              {user?.isPremium && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                  <CrownIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                {user?.isPremium && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-gray-600 flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <UserCircleIcon className="w-5 h-5 mr-2" />
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Account Status"
              value={user?.isPremium ? "Premium Member" : "Free Account"}
              icon={<BadgeCheckIcon className="w-5 h-5 text-green-600" />}
            />

            <InfoItem
              label="Member Since"
              value="January 15, 2023"
              icon={<CalendarIcon className="w-5 h-5 text-blue-600" />}
            />

            <InfoItem
              label="Subscription Plan"
              value={user?.isPremium ? "Annual Plan" : "Basic Plan"}
              icon={<CreditCardIcon className="w-5 h-5 text-purple-600" />}
            />

            <InfoItem
              label="Next Billing"
              value={user?.isPremium ? "December 15, 2023" : "N/A"}
              icon={<CalendarIcon className="w-5 h-5 text-orange-600" />}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Account Actions
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
              Edit Profile
            </button>

            {!user?.isPremium && (
              <button className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200">
                Upgrade to Premium
              </button>
            )}

            <button className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200">
              Account Settings
            </button>
          </div>
        </div>
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
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

// SVG Icons
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
