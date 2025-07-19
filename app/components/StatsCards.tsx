"use client";

import { useGetExpenseStatsQuery } from "@/lib/features/expenses/expensesApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Target,
  Loader2,
} from "lucide-react";
import { daysInWeek } from "date-fns/constants";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { useSelector } from "react-redux";

export function StatsCards() {
  const user = useSelector(selectCurrentUser);
  const {
    data: stats,
    isLoading,
    error,
  } = useGetExpenseStatsQuery(user?._id || "");
  console.log(stats, " Stats Data");
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Unable to load statistics
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalExpenses} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.averageExpense)}
          </div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(
              stats.monthlySpending[stats.monthlySpending.length - 1]?.amount ||
                0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.monthlySpending[stats.monthlySpending.length - 1]?.count ||
              0}{" "}
            transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.budgetStatus.percentage.toFixed(0)}%
          </div>
          <Progress value={stats.budgetStatus.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {formatCurrency(stats.budgetStatus.remaining)} remaining
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
