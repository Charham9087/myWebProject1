import ViewProductPage from "@/components/FrontendComponents/admin/orders/viewDetails/page"

export default async function page({searchParams}){
    const params = await searchParams;
    const orderId = params?._id 
    return(
        <ViewProductPage orderId={orderId} />
    )

}