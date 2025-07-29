"use client";
import { useGetLeaderboardQuery } from "@/lib/features/Premium/premiuemapi";
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  DollarSign,
  Target,
} from "lucide-react";

interface LeaderboardUser {
  _id: string;
  userId: string;
  totalAmount: number;
  totalExpenses: number;
  name: string;
  email: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-amber-600" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-500" />;
    case 3:
      return <Medal className="w-5 h-5 text-orange-600" />;
    default:
      return (
        <span className="w-5 h-5 flex items-center justify-center text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
          {rank}
        </span>
      );
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function LeaderboardPage() {
  const { data, isLoading, error } = useGetLeaderboardQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700 font-medium">
                Failed to load leaderboard
              </p>
              <p className="text-red-600 text-sm mt-1">
                Please try again later
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No Data Available
            </h2>
            <p className="text-gray-500">
              Start tracking expenses to see the leaderboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  const topSpender = data[0];
  const totalExpensesSum = data.reduce(
    (sum, user) => sum + user.totalExpenses,
    0
  );
  const totalAmountSum = data.reduce((sum, user) => sum + user.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expense Leaderboard
          </h1>
          <p className="text-gray-600">
            Track and compare spending across users
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalAmountSum)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalExpensesSum.toLocaleString()}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Top Spender
                </p>
                <p className="text-xl font-bold text-gray-900 truncate">
                  {topSpender.name}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Rankings
            </h2>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-200">
            {data.map((user: LeaderboardUser, index: number) => {
              const rank = index + 1;
              const percentage = (user.totalAmount / totalAmountSum) * 100;

              return (
                <div
                  key={user.userId}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    rank <= 3 ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left side - Rank and User Info */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {getRankIcon(rank)}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Stats */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(user.totalAmount)}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>{user.totalExpenses} expenses</span>
                        <span>•</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          rank === 1
                            ? "bg-amber-500"
                            : rank === 2
                            ? "bg-slate-400"
                            : rank === 3
                            ? "bg-orange-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Track your expenses regularly to improve your ranking
          </p>
        </div>
      </div>
    </div>
  );
}
