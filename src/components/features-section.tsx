"use client"

import { Card } from "@/components/ui/card"
import { Bot, MessageSquare, Target, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "Real-Time AI Interviewer",
    description:
      "Practice with an intelligent AI that adapts to your responses and challenges you with realistic questions tailored to your industry.",
  },
  {
    icon: MessageSquare,
    title: "Smart Feedback Analysis",
    description:
      "Get detailed insights on your communication, confidence, body language, and technical knowledge after each session.",
  },
  {
    icon: Target,
    title: "Question Bank by Role",
    description:
      "Access curated questions specific to your target position and industry for focused preparation and skill building.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress with Insights",
    description:
      "Monitor your improvement over time with comprehensive analytics, performance metrics, and personalized recommendations.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-[#222222] mb-6 leading-tight">
            Powerful Features for Interview Success
          </h2>
          <p className="text-xl sm:text-xl text-[#556B7F] max-w-3xl mx-auto leading-relaxed">
            Everything you need to prepare and excel in your next interview with cutting-edge AI technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="relative overflow-hidden p-8 sm:p-10 rounded-2xl border border-gray-100 bg-white transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl group"
              >
                {/* Light green background on hover */}
                <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0"></div>

                <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-green-50 group-hover:bg-gradient-to-br from-green-600 to-green-400 transition-all duration-300">
                      <Icon className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 mt-4 sm:mt-0">
                    <h3 className="text-2xl font-bold text-[#222222] mb-3 group-hover:text-[#00C853] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#556B7F] text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
