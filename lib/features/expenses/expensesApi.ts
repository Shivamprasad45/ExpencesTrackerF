// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Expense {
  _id: string; // For compatibility with existing code
  title: string;
  description: string;
  amount: number;
  category: string;
  tags: string[];
  date: string;
  paymentMethod: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  userId: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  tags: string[];
  date: string;
  paymentMethod: string;
  isRecurring: boolean;
  recurringFrequency?: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface ExpenseFilters {
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: string;
  search?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageExpense: number;
  categoriesSpending: Record<string, number>;
  monthlySpending: Array<{ month: string; amount: number; count: number }>;
  paymentMethodDistribution: Record<string, number>;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  budgetStatus: {
    totalBudget: number;
    spent: number;
    remaining: number;
    percentage: number;
  };
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string; // monthly, yearly
  spent: number;
  createdAt: string;
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ... (keep all your existing interfaces)

export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/expenses", // Update with your backend URL
    prepareHeaders: (headers) => {
      // Add JWT token to requests
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Expense", "Stats", "Budget"],
  endpoints: (builder) => ({
    getExpenses: builder.query<
      Expense[],
      { filters: ExpenseFilters; userId: string }
    >({
      query: ({ filters, userId }) => ({
        url: `/${userId}`,
        method: "GET",
        params: {
          ...filters,
          tags: filters.tags?.join(","), // Convert array to comma-separated string
        },
      }),
      providesTags: ["Expense"],
    }),

    getExpense: builder.query<Expense[], string>({
      query: (userId) => `/Users/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Expense", id: userId },
      ],
    }),

    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      query: (newExpense) => ({
        url: "/",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["Expense", "Stats"],
    }),

    updateExpense: builder.mutation<Expense, UpdateExpenseRequest>({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Expense", id },
        "Stats",
      ],
    }),

    deleteExpense: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "Stats"],
    }),

    getExpenseStats: builder.query<ExpenseStats, string>({
      query: (id) => `/stats/${id}`,
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseStatsQuery,
} = expensesApi;
