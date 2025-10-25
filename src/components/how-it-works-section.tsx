"use client"

const steps = [
  {
    number: "01",
    title: "Choose Your Interview",
    description: "Select from 50+ interview types including technical, behavioral, and industry-specific interviews.",
  },
  {
    number: "02",
    title: "Practice with AI",
    description: "Have a natural conversation with our AI interviewer that adapts to your responses.",
  },
  {
    number: "03",
    title: "Get Instant Feedback",
    description: "Receive detailed analysis on your performance across multiple dimensions.",
  },
  {
    number: "04",
    title: "Track Progress",
    description: "Monitor your improvement and identify areas to focus on for your next practice session.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:py-32 bg-white">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-5xl sm:text-6xl font-bold text-[#222222]">How It Works</h2>
          <p className="text-xl text-[#556B7F] max-w-3xl mx-auto leading-relaxed">
            Four simple steps to interview mastery
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          {steps.map((step, index) => {
            // For desktop: left column lines = index 0,2; right column = 1,3
            // For mobile: lines connect vertically all steps
            const isLast = index === steps.length - 1
            return (
              <div key={index} className="flex gap-6 relative">
                {/* Number + line */}
                <div className="flex flex-col items-center relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00C853] text-white font-bold text-sm z-10">
                    {step.number}
                  </div>

                  {/* Vertical line for mobile */}
                  {!isLast && (
                    <div className="absolute top-12 h-full w-0.5 bg-gradient-to-b from-[#00C853] to-[#E8F5E9] md:hidden" />
                  )}

                  {/* Vertical line for desktop: connect 1→3 and 2→4 */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 h-[calc(100%+2rem)] w-0.5 bg-gradient-to-b from-[#00C853] to-[#E8F5E9]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <h3 className="mb-3 text-xl font-bold text-[#222222]">{step.title}</h3>
                  <p className="text-base text-[#556B7F] leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
