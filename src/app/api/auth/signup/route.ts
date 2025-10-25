import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";
import { json } from "stream/consumers";

export async  function POST(req:Request){

  const{email,password,name}=
     await req.json();

     if(!email || !password){
      return new Response(JSON.stringify({error:"MissingFields"}),{status:400})
     }
    
     const existing= await prisma.user.findUnique({
      where:{email}
     })
     if(existing){
       return new Response(JSON.stringify({error:"User Already Exists"}),{status:400})
     }

     const hashedPassword= await  bcrypt.hash(password,10);


     const createUser= await prisma.user.create({
      data:{email,name,password:hashedPassword}
     })

     return new Response(JSON.stringify({createUser}),{status:201})
}