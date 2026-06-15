import 'dotenv/config';
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";
// If your Prisma file is located elsewhere, you can change the path

const trustedOrigins =
  process.env.TRUSTED_ORIGINS
    ?.split(',')
    .map(origin => origin.trim()) || [];

console.log("TRUSTED_ORIGINS:", trustedOrigins);

console.log("TRUSTED_ORIGINS:", trustedOrigins);
console.log(process.env.BETTER_AUTH_URL);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: { 
    enabled: true, 
  },
  user: {
    deleteUser:{
        enabled: true,
    }
  },
  

  trustedOrigins: [
    "http://localhost:5173",
    "https://ai-site-builder-jet-five.vercel.app",
  ],
  
  
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  advanced: {
    cookies:{
        session_token:{
            name:'auth_session',
            attributes:{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
            }
        }
    }
    
  }
  
});