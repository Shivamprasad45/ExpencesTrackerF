"use client";

import { useCreateExpenseMutation } from "@/lib/features/expenses/expensesApi";
import { ExpenseForm } from "../components/ExpenseForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";

export default function AddExpense() {
  const user = useSelector(selectCurrentUser);
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const router = useRouter();
  console.log(user?._id, "sds");

  // if (user === undefined) {
  //   router.push("/login");
  // }
  const handleSubmit = async (data: any) => {
    try {
      console.log(data, "sdsds");
      await createExpense({ ...data, userId: user?._id }).unwrap();
      toast.success("Expense added successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Add New Expense</h1>
        <p className="text-muted-foreground mt-2">
          Log a new expense to track your spending
        </p>
      </div>

      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/")}
        isLoading={isLoading}
      />
    </div>
  );
}
