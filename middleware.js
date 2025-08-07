import { NextResponse } from "next/server";


export default async function middleware(request) {


    const forbidden_html = `<html><body>403 Not allowed</body></html>`;


    try {

        // SEND COOKIES TO API ROUTE FOR VERIFICATION:
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-admin`,{
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                 "cookie":request.headers.get('cookie') || ""
            }
        });
        if(!res.ok){
            throw new Error("RECEIEVD BAD RESPONSE FROM API, NOT ALLOWED!")
        }

        const {email}= await res.json();

        console.log(`Admin access granted to ${email} at UNIX time : ${Date.now()}`);

        return NextResponse.next();





    }

    catch (err) {


        console.log("FAILED TO ALLOW ADMIN ACCESS AT MIDDLEWARE! logs:",err.message);



        return new NextResponse(forbidden_html, {
            status: 403,
            headers: {
                "Content-Type": "text/html"
            }

        });
    }







}


export const config = {
    matcher: ['/admin/:path*']
}