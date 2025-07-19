"use client";

import type { Expense } from "@/lib/features/expenses/expensesApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  Repeat,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const categoryColors = {
  "Food & Dining": "bg-orange-100 text-orange-800",
  Transportation: "bg-blue-100 text-blue-800",
  Entertainment: "bg-purple-100 text-purple-800",
  Utilities: "bg-green-100 text-green-800",
  "Health & Fitness": "bg-red-100 text-red-800",
  Shopping: "bg-pink-100 text-pink-800",
  Travel: "bg-teal-100 text-teal-800",
  Education: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
};

const paymentMethodIcons = {
  "Credit Card": CreditCard,
  "Debit Card": CreditCard,
  Cash: DollarSign,
  "Bank Transfer": CreditCard,
};

export function ExpenseCard({
  expense,
  onEdit,
  onDelete,
  compact = false,
}: ExpenseCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const PaymentIcon =
    paymentMethodIcons[
      expense.paymentMethod as keyof typeof paymentMethodIcons
    ] || CreditCard;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg leading-tight">
                {expense.title}
              </h3>
              {expense.isRecurring && (
                <Badge variant="outline" className="text-xs">
                  <Repeat className="h-3 w-3 mr-1" />
                  {expense.recurringFrequency}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(expense.date), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <PaymentIcon className="h-4 w-4" />
                {expense.paymentMethod}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(expense.amount)}
              </div>
            </div>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(expense._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!compact && expense.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {expense.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge
            className={
              categoryColors[expense.category as keyof typeof categoryColors] ||
              categoryColors.Other
            }
          >
            {expense.category}
          </Badge>
        </div>

        {expense.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {expense.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
