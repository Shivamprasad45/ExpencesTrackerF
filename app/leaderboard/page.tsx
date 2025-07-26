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
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return (
        <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
          #{rank}
        </span>
      );
  }
};

const getRankStyles = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-lg transform scale-105";
    case 2:
      return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-md";
    case 3:
      return "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-md";
    default:
      return "bg-white border-gray-200 hover:shadow-md hover:border-gray-300";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-medium">
                Failed to load leaderboard
              </p>
              <p className="text-red-500 text-sm mt-2">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              No Data Yet
            </h2>
            <p className="text-gray-500">
              Start tracking expenses to see the leaderboard!
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Expense Leaderboard
            </h1>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Who&apos;s spending the most? 💸
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalAmountSum)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalExpensesSum.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Top Spender</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {topSpender.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Rankings
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {data.map((user: LeaderboardUser, index: number) => {
                const rank = index + 1;
                const percentage = (user.totalAmount / totalAmountSum) * 100;

                return (
                  <div
                    key={user.userId}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300
                      ${getRankStyles(rank)}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(rank)}
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(user.totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{user.totalExpenses} expenses</span>
                          <span>{percentage.toFixed(1)}% of total</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            rank === 1
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : rank === 2
                              ? "bg-gradient-to-r from-gray-400 to-gray-600"
                              : rank === 3
                              ? "bg-gradient-to-r from-orange-400 to-orange-600"
                              : "bg-gradient-to-r from-blue-400 to-blue-600"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Rank badge for top 3 */}
                    {rank <= 3 && (
                      <div
                        className={`
                        absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                        ${
                          rank === 1
                            ? "bg-yellow-500"
                            : rank === 2
                            ? "bg-gray-500"
                            : "bg-orange-500"
                        }
                      `}
                      >
                        {rank}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">
            💡 <strong>Tip:</strong> Track your expenses regularly to climb the
            leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
}
