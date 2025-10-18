"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BadgeCheck,
  XCircle,
  Eye,
  Truck,
  Pencil,
  Save,
  Loader2,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Grid3x3,
  List,
} from "lucide-react"
import {
  ShowOrderPageData,
  UpdateAdvanceAmount,
  ToggleVerify,
  ToggleShipped,
  CancelOrder,
  RestoreOrder,
} from "@/server/orders"
import { useRouter } from "next/navigation"

/* Helper to parse createdAt variants (ISO string, object with $date, Date) */
function parseCreatedAt(createdAt) {
  if (!createdAt) return null
  if (typeof createdAt === "string") return new Date(createdAt)
  if (createdAt instanceof Date) return createdAt
  if (createdAt?.$date) return new Date(createdAt.$date)
  try {
    return new Date(JSON.stringify(createdAt))
  } catch {
    return null
  }
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-card border border-border p-4 sm:p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4">
        <p className="mb-4 sm:mb-6 text-foreground text-sm" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="flex justify-end gap-2 sm:gap-3">
          <Button variant="outline" onClick={onCancel} className="text-xs sm:text-sm bg-transparent">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status, isCancelled }) {
  if (isCancelled) {
    return (
      <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">
        <XCircle className="w-3 h-3 flex-shrink-0" /> Cancelled
      </span>
    )
  }
  if (status === "shipped") {
    return (
      <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> Shipped
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
      <AlertCircle className="w-3 h-3 flex-shrink-0" /> Pending
    </span>
  )
}

function VerificationBadge({ isVerified }) {
  return isVerified ? (
    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
      <BadgeCheck className="w-3 h-3 flex-shrink-0" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 whitespace-nowrap">
      Unverified
    </span>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [editingAdvanceId, setEditingAdvanceId] = useState(null)
  const [confirmData, setConfirmData] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [viewMode, setViewMode] = useState("list")
  const [dateFilter, setDateFilter] = useState("all")
  const [rangeStart, setRangeStart] = useState("")
  const [rangeEnd, setRangeEnd] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const ordersData = await ShowOrderPageData()
      setOrders(ordersData || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      setNotification({ type: "error", message: "Failed to load orders." })
    } finally {
      setLoading(false)
    }
  }

  function handleAdvanceChange(id, value) {
    setOrders((prev) =>
      prev.map((order) => (order._id === id ? { ...order, AdvanceAmount: Number.parseFloat(value) || 0 } : order)),
    )
  }

  function customConfirm(message) {
    return new Promise((resolve) => {
      setConfirmData({ message, resolve })
    })
  }

  const saveAdvanceAmount = async (id) => {
    try {
      const order = orders.find((o) => o._id === id)
      if (!order) return

      const message = `Are you sure you want to add <strong>Rs.${order.AdvanceAmount}</strong> to order #: ${order.orderID}?`
      const confirmed = await customConfirm(message)
      if (!confirmed) return

      const remaining = (order.total ?? 0) - (order.AdvanceAmount ?? 0)
      await UpdateAdvanceAmount(id, order.AdvanceAmount, remaining)

      await fetchOrders()
      setEditingAdvanceId(null)
      setNotification({ type: "success", message: `Advance amount updated for order ${id}` })
    } catch (err) {
      console.error(err)
      setNotification({ type: "error", message: "Failed to update advance amount." })
    }
  }

  const closeConfirm = (answer) => {
    if (confirmData) {
      confirmData.resolve(answer)
      setConfirmData(null)
    }
  }

  const Notification = () =>
    notification && (
      <div
        className={`fixed top-4 right-4 left-4 sm:left-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${notification.type === "success"
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        onClick={() => setNotification(null)}
        style={{ cursor: "pointer", zIndex: 1000 }}
      >
        {notification.type === "success" ? (
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="truncate">{notification.message}</span>
      </div>
    )

  const toggleVerify = async (id) => {
    const order = orders.find((o) => o._id === id)
    if (!order) return

    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isVerified: !o.isVerified } : o)))

    try {
      await ToggleVerify(id, !order.isVerified)
      setNotification({ type: "success", message: `Order ${id} ${!order.isVerified ? "verified" : "unverified"}.` })
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isVerified: order.isVerified } : o)))
      console.error(err)
      setNotification({ type: "error", message: "Failed to update verification." })
    }
  }

  const toggleShipped = async (id) => {
    const order = orders.find((o) => o._id === id)
    if (!order) return

    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isShipped: !o.isShipped } : o)))

    try {
      await ToggleShipped(id, !order.isShipped)
      setNotification({
        type: "success",
        message: `Order ${order.orderID} ${!order.isShipped ? "shipped" : "set to pending"}.`,
      })
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isShipped: order.isShipped } : o)))
      console.error(err)
      setNotification({ type: "error", message: "Failed to update shipment." })
    }
  }

  const cancelOrder = async (id) => {
    const order = orders.find((o) => o._id === id)
    if (!order) return

    if (!window.confirm("Are you sure you want to cancel this order?")) return

    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isCancelled: true } : o)))

    try {
      await CancelOrder(id)
      setNotification({ type: "success", message: `Order ${id} cancelled.` })
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isCancelled: order.isCancelled } : o)))
      console.error(err)
      setNotification({ type: "error", message: "Failed to cancel order." })
    }
  }

  const restoreOrder = async (id) => {
    const order = orders.find((o) => o._id === id)
    if (!order) return

    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isCancelled: false } : o)))

    try {
      await RestoreOrder(id)
      setNotification({ type: "success", message: `Order ${id} restored.` })
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isCancelled: order.isCancelled } : o)))
      console.error(err)
      setNotification({ type: "error", message: "Failed to restore order." })
    }
  }

  const viewDetails = (id) => {
    router.push(`/admin/orders/viewOrderDetails?_id=${id}`)
  }

  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []

    if (rangeStart || rangeEnd) {
      const start = rangeStart ? new Date(rangeStart + "T00:00:00") : null
      const end = rangeEnd ? new Date(rangeEnd + "T23:59:59.999") : null

      return orders.filter((order) => {
        const created = parseCreatedAt(order.createdAt)
        if (!created) return false
        if (start && created < start) return false
        if (end && created > end) return false
        return true
      })
    }

    if (dateFilter === "all") return orders

    const now = new Date()
    if (dateFilter === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      return orders.filter((order) => {
        const created = parseCreatedAt(order.createdAt)
        if (!created) return false
        return created >= start && created < end
      })
    }

    if (dateFilter === "7") {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 7)
      return orders.filter((order) => {
        const created = parseCreatedAt(order.createdAt)
        if (!created) return false
        return created >= cutoff && created <= now
      })
    }

    if (dateFilter === "30") {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 30)
      return orders.filter((order) => {
        const created = parseCreatedAt(order.createdAt)
        if (!created) return false
        return created >= cutoff && created <= now
      })
    }

    return orders
  }, [orders, dateFilter, rangeStart, rangeEnd])

  function OrderCard({ order }) {
    return (
      <div className="border border-border rounded-lg bg-card p-3 sm:p-4 hover:shadow-md transition-shadow duration-150">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <span className="font-mono text-xs sm:text-sm font-semibold text-foreground truncate">
                #{order.orderID}
              </span>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-semibold text-foreground">Rs.{(order.total ?? 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              <VerificationBadge isVerified={order.isVerified} />
              <StatusBadge status={order.isShipped ? "shipped" : "pending"} isCancelled={order.isCancelled} />
            </div>

            <p className="text-xs text-muted-foreground truncate">{order.name}</p>
            <p className="text-xs text-muted-foreground truncate">{order.email}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {order.createdAt ? new Date(parseCreatedAt(order.createdAt)).toLocaleString() : ""}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              size="sm"
              onClick={() => viewDetails(order._id)}
              className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
            >
              <Eye className="w-3 h-3 mr-1" /> View
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleShipped(order._id)}
              disabled={order.isCancelled}
              className="text-xs h-8"
            >
              <Truck className="w-3 h-3 mr-1" /> {order.isShipped ? "Pending" : "Ship"}
            </Button>

            <Button
              size="sm"
              variant={order.isVerified ? "outline" : "default"}
              onClick={() => toggleVerify(order._id)}
              disabled={order.isCancelled}
              className="text-xs h-8"
            >
              <BadgeCheck className="w-3 h-3 mr-1" /> {order.isVerified ? "Unverify" : "Verify"}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {order.isCancelled ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => restoreOrder(order._id)}
                className="text-xs h-8 flex-1"
              >
                Restore
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => cancelOrder(order._id)}
                className="text-xs sm:text-sm h-8 flex-1 sm:h-9 text-red-500 border border-red-500 bg-transparent hover:bg-red-50"
              >
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Cancel
              </Button>

            )}
          </div>
        </div>
      </div>
    )
  }

  function OrderRow({ order }) {
    return (
      <div className="border border-border rounded-lg bg-card hover:bg-card/80 transition-colors overflow-hidden">
        <button
          onClick={() => setExpandedOrder(expandedOrder === order.orderID ? null : order.orderID)}
          className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-muted/50 transition-colors gap-2"
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-1 text-left min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs sm:text-sm font-semibold text-foreground truncate">
                  #{order.orderID}
                </span>
                <div className="hidden sm:flex gap-1">
                  <VerificationBadge isVerified={order.isVerified} />
                  <StatusBadge status={order.isShipped ? "shipped" : "pending"} isCancelled={order.isCancelled} />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{order.name}</p>
              <p className="text-xs text-muted-foreground truncate">{order.email}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-xs sm:text-sm text-foreground">Rs.{(order.total ?? 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform flex-shrink-0`}
            style={{ transform: expandedOrder === order.orderID ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {expandedOrder === order.orderID && (
          <>
            <Separator />
            <div className="p-3 sm:p-5 space-y-4 sm:space-y-6">
              <div className="sm:hidden flex flex-wrap gap-1">
                <VerificationBadge isVerified={order.isVerified} />
                <StatusBadge status={order.isShipped ? "shipped" : "pending"} isCancelled={order.isCancelled} />
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">
                    Customer
                  </h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-medium text-foreground truncate">{order.name}</p>
                    <p className="text-muted-foreground truncate">{order.email}</p>
                    <p className="text-muted-foreground truncate">{order.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">
                    Shipping Address
                  </h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="text-foreground">{order.address}</p>
                    <p className="text-muted-foreground">
                      {order.city}, {order.postal}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Total Amount</p>
                    <p className="font-semibold text-foreground">Rs.{(order.total ?? 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Advance Paid</p>
                    {editingAdvanceId === order.orderID ? (
                      <div className="flex gap-1 sm:gap-2">
                        <input
                          type="number"
                          value={order.AdvanceAmount ?? 0}
                          onChange={(e) => handleAdvanceChange(order._id, e.target.value)}
                          className="bg-background border border-border rounded px-2 py-1 w-16 sm:w-20 text-xs sm:text-sm text-foreground"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 sm:h-8 w-7 sm:w-8 p-0"
                          onClick={async () => await saveAdvanceAmount(order._id)}
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-semibold text-blue-400">Rs.{(order.AdvanceAmount ?? 0).toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 sm:h-6 w-5 sm:w-6 p-0"
                          onClick={() => setEditingAdvanceId(order._id)}
                        >
                          <Pencil className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Remaining</p>
                    <p className="font-semibold text-amber-400">
                      Rs.{((order.total ?? 0) - (order.AdvanceAmount ?? 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.comments && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Notes</h4>
                  <p className="text-xs sm:text-sm text-foreground bg-muted/30 rounded p-2 sm:p-3">{order.comments}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => viewDetails(order._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleShipped(order._id)}
                  disabled={order.isCancelled}
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{" "}
                  {order.isShipped ? "Mark Pending" : "Mark Shipped"}
                </Button>
                <Button
                  size="sm"
                  variant={order.isVerified ? "outline" : "default"}
                  onClick={() => toggleVerify(order._id)}
                  disabled={order.isCancelled}
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{" "}
                  {order.isVerified ? "Unverify" : "Verify"}
                </Button>
                {order.isCancelled ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => restoreOrder(order._id)}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => cancelOrder(order._id)}
                    className="text-xs sm:text-sm h-8 sm:h-9 text-red-500 border border-red-500 bg-transparent hover:bg-red-50"
                  >
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Cancel
                  </Button>

                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Orders</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage and track all customer orders</p>
            </div>

            <div className="text-right">
              <p className="text-xl sm:text-2xl font-semibold text-foreground">{filteredOrders.length}</p>
              <p className="text-xs text-muted-foreground">
                {rangeStart || rangeEnd || dateFilter !== "all" ? "Filtered Orders" : "Total Orders"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {notification && <Notification />}

      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
            <label className="text-xs sm:text-sm text-muted-foreground">Date</label>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setRangeStart("")
                setRangeEnd("")
              }}
              className="bg-background border border-border rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              <option value="all">Till Now (All)</option>
              <option value="today">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 ml-0 sm:ml-2">
              <label className="text-xs sm:text-sm text-muted-foreground">From</label>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => {
                  setRangeStart(e.target.value)
                  setDateFilter("all")
                }}
                className="bg-background border border-border rounded px-2 py-1.5 sm:py-2 text-xs sm:text-sm"
              />
              <label className="text-xs sm:text-sm text-muted-foreground">To</label>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => {
                  setRangeEnd(e.target.value)
                  setDateFilter("all")
                }}
                className="bg-background border border-border rounded px-2 py-1.5 sm:py-2 text-xs sm:text-sm"
              />

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setRangeStart("")
                  setRangeEnd("")
                }}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm text-muted-foreground">View</label>
            <div className="inline-flex gap-1 sm:gap-2">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                className="text-xs h-8 sm:h-9 px-2 sm:px-3"
              >
                <Grid3x3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="text-xs h-8 sm:h-9 px-2 sm:px-3"
              >
                <List className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader2 className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3" />
            <span className="text-xs sm:text-sm text-muted-foreground">Loading orders...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-xs sm:text-sm text-muted-foreground">No orders found.</p>
              </div>
            ) : (
              <>
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredOrders.map((order) => (
                      <div className="w-full">
                        <OrderCard key={order._id} order={order} />
                      </div>
                    ))}
                  </div>

                )}

                {/* LIST/ROW view */}
                {viewMode === "list" && (
                  <div className="space-y-2 sm:space-y-3">
                    {filteredOrders.map((order) => (
                      <OrderRow key={order.orderID} order={order} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {confirmData && (
        <ConfirmModal
          message={confirmData.message}
          onConfirm={() => closeConfirm(true)}
          onCancel={() => closeConfirm(false)}
        />
      )}
    </div>
  )
}  