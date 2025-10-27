import z, { email } from "zod";

export const  signupSchema= z.object({
  name:z.string().min(3,"Name must be at least 3 characters long"),
  email:z.email("Invalid email address"),
  password:z.string().min(6,"Password must be at least 6 characters long")
  .max(20,"Password must be at most 20 characters long"),
})


export const signinSchema=z.object({
  email:z.email("Invalid email address"),
  password:z.string().min(6,"Password must be at least 6 characters long")
})


export type SignupInput = z.infer<typeof signupSchema>;
export  type SigninInput = z.infer<typeof signinSchema>;