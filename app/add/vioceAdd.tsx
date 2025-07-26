"use client";

import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { useCreateExpenseAiMutation } from "@/lib/features/expenses/expensesApi";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

export default function VoiceExpense() {
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
      alert("Speech recognition not supported in your browser.");
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

  const speakParsedExpense = (data: any) => {
    if (!window.speechSynthesis) return;

    const message = `You spent ${data.amount} rupees on ${data.title} in the category ${data.category} on ${data.date}.`;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const sendToGemini = async () => {
    try {
      const data = await createExpenseAi({
        userId: user?._id || "",
        text: transcript,
      }).unwrap();

      setParsedExpense(data);
      speakParsedExpense(data);
    } catch (error) {
      console.error("Failed to parse expense:", error);
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
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Add Expense with Voice
        </h2>

        <div className="flex flex-col items-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <div className="text-white">
              {isListening ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
          <p className="mt-3 text-sm text-gray-600">
            {isListening ? "Listening..." : "Tap to speak"}
          </p>
        </div>

        {transcript && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-blue-800">You said:</p>
                <p className="mt-2 text-blue-900">{transcript}</p>
              </div>
              <button
                onClick={resetState}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={sendToGemini}
              disabled={isLoading}
              className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? "bg-gray-300 text-gray-500"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Parse with AI"
              )}
            </button>
          </div>
        )}

        {parsedExpense && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-green-800">Expense Added</h3>
              <button
                onClick={resetState}
                className="text-green-500 hover:text-green-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-green-600">Title</p>
                <p className="font-medium">{parsedExpense.title}</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Amount</p>
                <p className="font-medium">₹{parsedExpense.amount}</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Category</p>
                <p className="font-medium capitalize">
                  {parsedExpense.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-600">Date</p>
                <p className="font-medium">
                  {new Date(parsedExpense.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {!transcript && !parsedExpense && (
          <div className="text-center text-sm text-gray-500 p-4">
            <p>Tap the microphone and say something like:</p>
            <p className="mt-2 font-medium">
              &quot;I spent 500 rupees on groceries today&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
