import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import User from "@/components/models/User";
import ConnectDB from "@/components/mongoConnect";
import { NextResponse } from "next/server";


export async function GET(request){
    try{
    
    const session = await getServerSession(authOptions);
    if(!session) throw new Error("NO session was found, not allowed!");


    await ConnectDB();
    const requester = await User.findOne({email:session.user.email});
    if(!requester?.role?.includes("admin")){
        throw new Error(`${session.user.email} is not an admin, not allowed!`);
    }

    console.log("ALLOWED ADMIN ACCESS TO",session.user.email);

    return NextResponse.json({email:session.user.email, msg:"Access allowed"},{status:200});


    }

    catch(err){
        console.log("FAILED TO VERIFY ADMIN RIGHTS  AT /api/auth/verify-admin. Logs:",err?.message);
        return NextResponse.json({msg:"ACCESS denied"},{status:403});

    }


}