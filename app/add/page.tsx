"use client";

import { useCreateExpenseMutation } from "@/lib/features/expenses/expensesApi";
import { ExpenseForm } from "../components/ExpenseForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
// import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { useCreateExpenseAiMutation } from "@/lib/features/expenses/expensesApi";
import { useState, useRef, useEffect } from "react";

// Voice Expense Component (Simplified and Integrated)
function VoiceExpenseAdd({ onExpenseAdded }: { onExpenseAdded: () => void }) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [parsedExpense, setParsedExpense] = useState<any>(null);
  const user = useSelector(selectCurrentUser);
  const [createExpenseAi, { isLoading }] = useCreateExpenseAiMutation();
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in your browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.continuous = false;

    recognitionRef.current.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => setIsListening(false);

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const sendToGemini = async () => {
    try {
      const data = await createExpenseAi({
        userId: user?._id || "",
        text: transcript,
      }).unwrap();

      setParsedExpense(data);
      toast.success("Expense added successfully with AI!");
      onExpenseAdded();
    } catch (error) {
      console.error("Failed to parse expense:", error);
      toast.error("Failed to process voice input");
    }
  };

  const resetState = () => {
    setTranscript("");
    setParsedExpense(null);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Quick Voice Add
          </h3>
          <p className="text-sm text-gray-600">Speak your expense naturally</p>
        </div>
        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
          Premium
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isListening ? (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {transcript ? (
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-900">{transcript}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={sendToGemini}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Add Expense"}
                </button>
                <button
                  onClick={resetState}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>
                Say:{" "}
                <span className="font-medium">
                  &quot;I spent 500 on groceries today&quot;
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isListening ? "Listening..." : "Click microphone to start"}
              </p>
            </div>
          )}
        </div>
      </div>

      {parsedExpense && (
        <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-green-800">
              Expense Added!
            </h4>
            <button
              onClick={resetState}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-green-600">Amount:</span> ₹
              {parsedExpense.amount}
            </div>
            <div>
              <span className="text-green-600">Category:</span>{" "}
              {parsedExpense.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddExpense() {
  const user = useSelector(selectCurrentUser);
  const [createExpense, { isLoading }] = useCreateExpenseMutation();
  const router = useRouter();
  const [showVoice, setShowVoice] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      await createExpense({ ...data, userId: user?._id }).unwrap();
      toast.success("Expense added successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const handleExpenseAdded = () => {
    // Optionally refresh or redirect after voice expense is added
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Add New Expense
          </h1>
          <p className="text-gray-600">Track your spending to stay on budget</p>
        </div>

        {/* Method Selection (Psychology: Give users choice and control) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Choose How to Add
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual Entry Option */}
            <button
              onClick={() => setShowVoice(false)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                !showVoice
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Manual Entry</h3>
                  <p className="text-sm text-gray-600">
                    Fill out the form step by step
                  </p>
                </div>
              </div>
            </button>

            {/* Voice Entry Option (Premium only) */}
            {user?.isPremium && (
              <button
                onClick={() => setShowVoice(true)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  showVoice
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">Voice Entry</h3>
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Speak naturally, AI does the rest
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {showVoice && user?.isPremium ? (
            <div className="p-6">
              <VoiceExpenseAdd onExpenseAdded={handleExpenseAdded} />
            </div>
          ) : (
            <div className="p-6">
              <ExpenseForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/")}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Helpful Tips (Psychology: Reduce anxiety with guidance) */}
        <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 Quick Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific with expense titles for better tracking</li>
            <li>• Choose the right category to see spending patterns</li>
            <li>• Add expenses regularly to stay on top of your budget</li>
            {user?.isPremium && (
              <li>• Use voice entry for quick logging on-the-go</li>
            )}
          </ul>
        </div>

        {/* Premium Upgrade CTA (Psychology: Show value, not pressure) */}
        {!user?.isPremium && (
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-amber-900">
                  Want faster expense tracking?
                </h3>
                <p className="text-sm text-amber-800">
                  Premium users can add expenses with voice commands
                </p>
              </div>
              <button
                onClick={() => router.push("/premium")}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
