import ViewProductPage from "@/components/FrontendComponents/viewProduct/page"
import { Suspense } from "react";

export default function page() {

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ViewProductPage />
            </Suspense>
        </>

    )
}