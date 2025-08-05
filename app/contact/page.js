import ContactPage from "@/components/FrontendComponents/contact/page";
import {SaveCustomerQueryToDB} from "@/server/customer_queries";

export default function contact(){
    return (

        <ContactPage SaveCustomerQueryToDB={SaveCustomerQueryToDB}/>
    )


}