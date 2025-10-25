"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { useState } from "react"

export default function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C853] via-[#00813E] to-[#005a2a]">
        {/* Dotted overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="2" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="1200" height="400" fill="url(#dots)" />
          </svg>
        </div>

        {/* Floating white elements */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 left-20 w-80 h-80 bg-white rounded-full opacity-5 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full px-6 py-2 mb-8 hover:bg-white/30 transition-all duration-300">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white font-semibold text-sm">Limited Time Offer</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Transform Your Interview Skills?
        </h2>
        <p className="text-base sm:text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of professionals who have already landed their dream jobs with AIVue. Start practicing today
          and see the difference.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white text-[#00C853] hover:bg-[#E8F5E9] px-8 sm:px-10 py-6 text-base sm:text-lg rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 font-bold group relative overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight
                className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`}
              />
            </span>
          </Button>

          <Button
            size="lg"
            className="border-2 border-white text-white hover:bg-white/10 px-8 sm:px-10 py-6 text-base sm:text-lg rounded-lg transition-all duration-300 bg-transparent w-full sm:w-auto"
          >
            Schedule Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">10K+</p>
            <p className="text-white/80 mt-1 sm:mt-2 text-xs sm:text-sm">Users Practicing</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">95%</p>
            <p className="text-white/80 mt-1 sm:mt-2 text-xs sm:text-sm">Success Rate</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white">4.9★</p>
            <p className="text-white/80 mt-1 sm:mt-2 text-xs sm:text-sm">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
