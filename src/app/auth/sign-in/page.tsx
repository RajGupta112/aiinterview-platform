"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { signinSchema, type SigninInput } from "@/lib/validationSchema"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SigninPage() {
  const router = useRouter()
  const [form, setForm] = useState<SigninInput>({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = signinSchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message)
      return
    }

    setLoading(true)
    const res = await signIn("credentials", {
      redirect: false,
      email: parsed.data.email,
      password: parsed.data.password,
    })
    setLoading(false)

    if (res?.error) {
      toast.error("Invalid credentials ❌")
    } else {
      toast.success("Welcome back 🎉")
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.15),transparent_40%)]" />
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 border border-green-100 shadow-2xl z-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/auth/sign-up")}
              className="text-green-600 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
