"use client"
import { SessionProvider } from "next-auth/react";


export default function NEXT_AUTH_PROVIDER({children}){

    return <SessionProvider>{children}</SessionProvider>
}

//
