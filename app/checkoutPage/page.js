import CheckoutPage from "@/components/FrontendComponents/checkoutPage/page"
import { Suspense } from "react"

export default function page(){
   
       return(
        <Suspense fallback={<div>Loading...</div>}>
        <CheckoutPage/>
        </Suspense>
       
       )
}