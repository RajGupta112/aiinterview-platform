"use client"

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function DashboardClient({user}:{user:any}) {
  const {data:session}= useSession();

  const currentUser=session?.user || user;



  return(
     <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome, {currentUser?.name || "User"} 👋
      </h1>
      <p className="text-gray-600">Email: {currentUser?.email}</p>

      <Button
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
      >
        Logout
      </Button>
    </div>
  )

}