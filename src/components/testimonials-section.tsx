"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    image: "/hel.png",
    quote:
      "AIVue helped me get my first job in 3 weeks! The feedback was incredibly detailed and helped me fix my weak points.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Meta",
    image: "/datascience.jpg",
    quote: "The AI interviewer felt so realistic. I went from nervous to confident after just a few practice sessions.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist at Amazon",
    image: "/she.png",
    quote: "Best investment I made for my career. The role-specific questions were exactly what I needed.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#222222] mb-4">Loved by Professionals</h2>
          <p className="text-xl text-[#556B7F] max-w-2xl mx-auto">
            Join thousands of successful candidates who landed their dream jobs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative p-8 border-l-4 border-l-gradient-green bg-white rounded-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden group"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0"></div>

              <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#00C853] text-[#00C853]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#222222] mb-6 leading-relaxed italic">{`"${testimonial.quote}"`}</p>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#222222]">{testimonial.name}</p>
                    <p className="text-sm text-[#556B7F]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
