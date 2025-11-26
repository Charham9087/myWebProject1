import AdminProductDetailPage from "@/components/FrontendComponents/admin/products/singleProduct/page"
import { Suspense } from "react"

export default function productdetailpage(){
    return(
        <Suspense fallback={<div>Loading...</div>}>
        <AdminProductDetailPage/>
        </Suspense>
    )
}