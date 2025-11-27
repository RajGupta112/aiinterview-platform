"use client"

import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient with mesh pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#E8F5E9] to-white">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <defs>
              <pattern id="mesh" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 Q25,25 50,50 T100,50" stroke="#00C853" strokeWidth="0.5" fill="none" opacity="0.3" />
                <path d="M50,0 Q75,25 50,50 T50,100" stroke="#00C853" strokeWidth="0.5" fill="none" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="1200" height="600" fill="url(#mesh)" />
          </svg>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#00C853] rounded-full opacity-10 blur-3xl float-animation"></div>
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-[#00C853] rounded-full opacity-5 blur-3xl float-animation"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="fade-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#222222] mb-6 leading-tight">
              Ace Your Next Interview with{" "}
              <span className="bg-gradient-to-r from-[#00C853] to-[#00813E] bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#556B7F] mb-8 leading-relaxed">
              Experience realistic AI-powered interviews and get feedback that helps you shine in the real one. Practice
              with confidence, interview with excellence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00C853] to-[#00813E] hover:from-[#00813E] hover:to-[#005a2a] text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                Start Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#00C853] text-[#00C853] hover:bg-[#E8F5E9] px-8 py-6 text-lg rounded-lg transition-all duration-300 bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold text-[#00C853]">10K+</p>
                <p className="text-[#556B7F]">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#00C853]">95%</p>
                <p className="text-[#556B7F]">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#00C853]">4.9★</p>
                <p className="text-[#556B7F]">Rating</p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#00C853]/20 to-[#00813E]/10 rounded-3xl blur-2xl"></div>
              <div className="relative glass-effect rounded-3xl p-8 glow-shadow overflow-hidden">
                <Image
                  src="/aaa.jpg"
                  alt="AI Interview Experience"
                  className="w-full rounded-2xl"
                  height={400}
                  width={400}
                loading="lazy"
                />
                {/* Overlay accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#00C853]/30 to-transparent rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
