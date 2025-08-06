import { ShowCustomerQueryToDB } from "@/server/customer_queries";
import AdminNotificationsPage from "@/components/FrontendComponents/admin/notifications/page";

export default async function page() {
    const initialQueries = await ShowCustomerQueryToDB(); // ✅ fetch data on server
    return <AdminNotificationsPage initialQueries={initialQueries} />; // ✅ pass it as prop
}
