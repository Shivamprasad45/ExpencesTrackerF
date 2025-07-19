"use client";
import { useState } from "react";
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
  type ExpenseFilters,
} from "@/lib/features/expenses/expensesApi";
import { ExpenseCard } from "../components/ExpenseCard";
import { FilterPanel } from "../components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { useSelector } from "react-redux";

export default function BrowseExpenses() {
  const user = useSelector(selectCurrentUser);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const {
    data: expenses,
    isLoading,
    error,
  } = useGetExpensesQuery({ filters: filters, userId: user?._id || "" });

  const [deleteExpense] = useDeleteExpenseMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id).unwrap();
      console.log(`Expense with id ${id} deleted successfully`);
      toast.success("Expense deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalAmount =
    expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Expenses</h1>
        <p className="text-muted-foreground mt-2">
          Search and filter through your spending history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading expenses...</span>
            </div>
          ) : error ? (
            <Card className="border-red-200">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 mb-4">Error loading expenses</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : expenses?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  No expenses found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or add some new expenses
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {expenses?.length} expense{expenses?.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
                <div className="text-sm font-semibold text-red-600">
                  Total: {formatCurrency(totalAmount)}
                </div>
              </div>

              <div className="grid gap-4">
                {expenses?.map((expense) => (
                  <ExpenseCard
                    key={expense._id}
                    expense={expense}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
