import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  ShoppingCart,
  Package,
  Users,
  BarChart,
  LineChart,
  DollarSign,
  CreditCard,
  PieChart,
  Store,
  Tag,
  Truck,
  UserCheck,
  UserPlus,
  Warehouse,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Activity,
} from "lucide-react";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon:Package,
  },
  {
    title: "Orders",
    url: "#",
    icon: Truck,
  },
  {
    title: "analytics",
    url: "#",
    icon: BarChart,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
   {
    title: "A Store",
    url: "/",
    icon: Store,
  }
]
export default function AppSidebar() {
  return (
    <Sidebar className="bg-black" open={true}> {/* ✅ Force open */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>A Store</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
