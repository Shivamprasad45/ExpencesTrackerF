"use client";

import { useGetExpenseQuery } from "@/lib/features/expenses/expensesApi";
import { StatsCards } from "./components/StatsCards";
import { ExpenseCard } from "./components/ExpenseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Receipt,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { skipToken } from "@reduxjs/toolkit/query";

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default items per page
  const { data: response, isLoading } = useGetExpenseQuery(
    userId ? { userId, page, limit } : skipToken
  );

  const expenses = response?.expenses || [];
  const pagination = response?.pagination;

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when changing limit
  };

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track and analyze your spending habits
          </p>
        </div>
        <Link href="/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/add">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Add Expense</h3>
              <p className="text-sm text-muted-foreground">
                Log a new expense or purchase
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/browse">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Receipt className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Browse All</h3>
              <p className="text-sm text-muted-foreground">
                View and filter your expenses
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Spending insights and trends
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Expense List with Pagination */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Your Expenses</CardTitle>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm whitespace-nowrap">
                  Items per page:
                </span>
                <select
                  value={limit}
                  onChange={handleLimitChange}
                  className="border rounded-md p-2 text-sm"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <Link href="/browse">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <ExpenseCard key={expense._id} expense={expense} compact />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No expenses yet. Start by adding your first one!</p>
              <Link href="/add">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </Link>
            </div>
          )}
        </CardContent>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 0 && (
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, pagination.totalItems)} of{" "}
                {pagination.totalItems} expenses
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
