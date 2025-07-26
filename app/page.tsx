"use client";

import {
  useGetExpenseQuery,
  useGetExpensesQuery,
} from "@/lib/features/expenses/expensesApi";
import { StatsCards } from "./components/StatsCards";
import { ExpenseCard } from "./components/ExpenseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Receipt, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { skipToken } from "@reduxjs/toolkit/query";

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;

  const { data: expenses, isLoading } = useGetExpenseQuery(
    userId ? userId : skipToken
  );

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const recentExpenses = expenses?.slice(0, 3) || [];

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

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Link href="/browse">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
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
      </Card>
    </div>
  );
}
