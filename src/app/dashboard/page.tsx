import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "../../components/dashboardClient";
import { SessionProvider } from "next-auth/react";
import SessionProviderWrapper from "@/components/components/SessionProviderWrapper";

export default async function dashboard() {
  const session = await getServerSession(authOptions);
  if(!session){
    redirect("/auth/sign-in");
  }

  return(
   
        <div className="p-6">
      <DashboardClient user={session.user}/>
    </div>
   
   
  )
  
}