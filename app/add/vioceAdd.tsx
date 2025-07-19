"use client";

import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { useCreateExpenseAiMutation } from "@/lib/features/expenses/expensesApi";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function VoiceExpense() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [parsedExpense, setParsedExpense] = useState<any>(null);
  const user = useSelector(selectCurrentUser);
  const [createExpenseAi] = useCreateExpenseAiMutation();
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const speakParsedExpense = (data: any) => {
    if (!window.speechSynthesis) return;

    const message = `You spent ${data.amount} rupees on ${data.title} in the category ${data.category} on ${data.date}.`;
    const utterance = new SpeechSynthesisUtterance(message);

    utterance.lang = "en-IN"; // Indian English
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const sendToGemini = async () => {
    // const res = await fetch(
    //   `http://localhost:5000/api/expenses/gemini-expense/:${user?._id}`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ text: transcript }),
    //     headers: { "Content-Type": "application/json" },
    //   }
    // );

    // const data = await res.json();
    // setParsedExpense(data.data);
    const data = await createExpenseAi({
      userId: user?._id || "",
      text: transcript,
    }).unwrap();
    // 🔊 Speak it back
    speakParsedExpense(data);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
      <button
        onClick={startListening}
        disabled={isListening}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        🎤 {isListening ? "Listening..." : "Speak Expense"}
      </button>

      {transcript && (
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">You said:</p>
          <p>{transcript}</p>
          <button
            onClick={sendToGemini}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Parse with Gemini
          </button>
        </div>
      )}

      {parsedExpense && (
        <div className="bg-gray-50 p-4 border rounded">
          <p className="font-semibold mb-2">Parsed Expense:</p>
          <pre className="text-sm text-gray-800">
            {JSON.stringify(parsedExpense, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
