"use server"

import ConnectDB from "@/components/mongoConnect"
import CustomerQuery from "@/components/models/customer_queries"


export  async function SaveCustomerQueryToDB(data){
    const {name,email,phone,message} = data;
    console.log('data recieved from frontend',data)
    try{
        await ConnectDB();
        console.log('connected to DB successfully')
        await CustomerQuery.create({
            name:name,
            email:email,
            phone:phone,
            message:message
        })
        console.log('data saved to DB successfully')
        return true;
    }catch{
        console.log('error saving data to DB')
        return false;

    }
}
