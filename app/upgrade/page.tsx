"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Mic, BarChart, Download, Headphones } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/features/auth/authSlice";
// import { useSession } from "next-auth/react";

const Pricing = () => {
  // const { data: session } = useSession();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const plans = [
    {
      name: "Freemium",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started with basic expense tracking",
      features: [
        "Basic expense tracking",
        "Up to 3 categories",
        "Manual entry only",
        "Basic monthly reports",
        "Limited to 50 transactions/month",
      ],
      cta: "Get Started",
      popular: false,
      color: "bg-gray-100",
    },
    {
      name: "Premium",
      price: "₹299",
      period: "per month",
      description: "Advanced features for serious financial management",
      features: [
        "AI-powered expense analysis",
        "Unlimited categories",
        "Voice command expenses",
        "Advanced financial reports",
        "PDF/Excel export",
        "Priority support",
        "Unlimited transactions",
      ],
      cta: "Go Premium",
      popular: true,
      color: "bg-gradient-to-r from-blue-50 to-indigo-50",
    },
  ];

  const features = [
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice Commands",
      description: "Add expenses hands-free with AI voice recognition",
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: "Advanced Reports",
      description: "Visual insights into your spending patterns",
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Data Export",
      description: "Export your data to PDF, Excel or CSV formats",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Priority Support",
      description: "24-hour response time for all your queries",
    },
  ];

  const initiatePayment = async () => {
    setLoading(true);
    setError("");

    try {
      if (!user || !user._id) {
        throw new Error("You need to be logged in to purchase premium");
      }

      // Create order on backend
      const response = await axios.post(`${url}/api/payment/create-order`, {
        userId: user._id,
        amount: 29900, // in paise (299 * 100)
        currency: "INR",
      });

      const { order } = response.data;

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: "rzp_test_ZFv4tTm10wX2io",
          amount: order.amount,
          currency: order.currency,
          name: "Expense Tracker Premium",
          description: "Premium Plan Subscription",
          order_id: order.id,
          handler: async function (response: any) {
            // Verify payment on backend
            await axios.post(`${url}/api/payment/verify`, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId: user._id,
            });

            alert("Payment successful! Your premium account is now active.");
          },
          prefill: {
            name: user.name || "",
            email: user.email || "",
          },
          theme: {
            color: "#6366f1",
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Payment failed");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Simple Pricing, Powerful Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Choose the plan that works best for your financial tracking needs.
            Premium unlocks powerful AI features for better money management.
          </motion.p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${plan.color} rounded-2xl shadow-lg overflow-hidden flex-1 max-w-md`}
            >
              <div className="p-8">
                {plan.popular && (
                  <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-full mb-4">
                    MOST POPULAR
                  </div>
                )}

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-6 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="ml-2 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.popular ? initiatePayment : () => {}}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl"
                      : "bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {loading && plan.popular ? (
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
                    ) : plan.popular ? (
                      <Zap className="w-5 h-5 mr-2" fill="currentColor" />
                    ) : null}
                    {loading && plan.popular ? "Processing..." : plan.cta}
                  </div>
                </button>

                {error && plan.popular && (
                  <div className="mt-3 text-red-500 text-sm">{error}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "Can I switch plans later?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time.",
              },
              {
                question: "Is there a free trial for Premium?",
                answer:
                  "Yes! We offer a 14-day free trial for our Premium plan with no credit card required.",
              },
              {
                question: "How does the voice command feature work?",
                answer:
                  "Just tap the microphone icon and speak your expense. Our AI will automatically categorize and log it.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, UPI, net banking, and wallets via Razorpay's secure payment gateway.",
              },
              {
                question: "How do I cancel my subscription?",
                answer:
                  "You can cancel anytime from your account settings. No cancellation fees.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
