"use client"

import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E8F5E9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#00C853] to-[#00813E] bg-clip-text text-transparent mb-2">
              AIVue
            </div>
            <p className="text-[#556B7F] text-sm">Master your interviews with AI-powered practice and feedback.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#222222] mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8F5E9] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-[#556B7F] text-sm mb-4 md:mb-0">© 2025 AIVue. All rights reserved.</p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#556B7F] hover:text-[#00C853] transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
