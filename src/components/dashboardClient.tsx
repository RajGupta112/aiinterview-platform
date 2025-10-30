"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  Bot,
  Headphones,
  LogOut,
  Menu,
  X,
  FileText, // ✅ added icon for resume interview
} from "lucide-react";
import { useState } from "react";

export default function DashboardClient({ user }: { user: any }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = session?.user || user;

  // ✅ Added "AI Resume Interview" to menu (nothing else changed)
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard" },
    { name: "AI Interview", icon: <Bot className="w-5 h-5" />, path: "/interview" },
    { name: "AI Resume Interview", icon: <FileText className="w-5 h-5" />, path: "/resume-interview" },
    { name: "Support", icon: <Headphones className="w-5 h-5" />, path: "/support" },
  ];

  const categories = [
    { title: "Software Engineer", desc: "Test your coding & system design skills." },
    { title: "Full Stack Developer", desc: "Challenge both frontend & backend knowledge." },
    { title: "DevOps Engineer", desc: "Assess CI/CD, Docker, and cloud deployment skills." },
    { title: "Marketing Strategist", desc: "Explore data-driven growth interviews." },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 text-gray-800">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white/90 border-r border-orange-100 shadow-sm p-5 flex-col justify-between backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-extrabold text-orange-600 mb-10">AIVEU</h2>
          <nav className="space-y-2">
            {menu.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.path)}
                className="flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 transition-all"
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
          className="flex items-center gap-3 text-red-600 hover:bg-orange-500"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </aside>

      {/* Sidebar (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed md:hidden top-0 left-0 z-50 h-full w-64 bg-white p-6 shadow-md transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-orange-600">AIVEU</h2>
          <X className="w-6 h-6 cursor-pointer text-gray-700" onClick={() => setSidebarOpen(false)} />
        </div>
        <nav className="space-y-2">
          {menu.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(item.path);
                setSidebarOpen(false);
              }}
              className="flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 transition-all"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
        <div className="mt-10">
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
            className="flex items-center gap-3 text-red-600 hover:bg-red-500"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 sm:p-8 md:p-10 space-y-8">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-xl font-bold text-orange-600">AIVEU</h2>
          <Menu className="w-6 h-6 text-gray-700 cursor-pointer" onClick={() => setSidebarOpen(true)} />
        </div>

        {/* Greeting Card */}
        <Card className="bg-white shadow-md border border-orange-100 rounded-2xl">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Hey! {currentUser?.name || "User"} 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Get ready for exciting insights. Start your interview with{" "}
                <span className="text-orange-600 font-semibold">AIVEU</span>!
              </p>
            </div>
            <Button
              onClick={() => router.push("/interview")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg shadow-sm"
            >
              Start Interview
            </Button>
          </CardContent>
        </Card>

        {/* Categories */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            Available Interview Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <Card
                key={i}
                className="bg-white border border-orange-100 hover:border-orange-200 shadow-sm hover:shadow-md transition-all rounded-xl"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                  </div>
                  <Button
                    onClick={() => router.push(`/interview?role=${encodeURIComponent(c.title)}`)}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-3 rounded-lg"
                  >
                    Start
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
