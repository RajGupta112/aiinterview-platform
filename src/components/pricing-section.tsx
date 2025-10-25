"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Getting started",
    features: ["5 AI interviews/month", "Basic feedback", "Question bank", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For serious prep",
    features: [
      "Unlimited interviews",
      "Advanced feedback",
      "Full question bank",
      "Priority support",
      "Custom scenarios",
      "Resume review",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams",
    features: [
      "Everything Pro",
      "Team management",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs and level up your interview skills.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative p-8 rounded-2xl transition-transform duration-300 transform ${
                plan.highlighted
                  ? "border-0 bg-gradient-to-br from-green-100 to-green-50 shadow-2xl scale-105"
                  : "border border-green-200 bg-white hover:scale-105 hover:shadow-lg"
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div className="absolute top-4 right-4 inline-block bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md">
                  Most Popular
                </div>
              )}

              {/* Plan Name & Description */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-2">
                <span className={`font-bold ${plan.highlighted ? "text-4xl" : "text-3xl"} text-gray-900`}>
                  {plan.price}
                </span>
                {plan.period && <span className="text-gray-600 text-base">{plan.period}</span>}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                    : "border-2 border-green-600 text-green-600 hover:bg-green-50"
                }`}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <div className="mt-6 space-y-3">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
