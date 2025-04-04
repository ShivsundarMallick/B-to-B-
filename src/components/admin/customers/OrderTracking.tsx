import React, { useState } from "react";
import { mockCustomers } from "./CustomerManagement";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Search,
  Package,
  Truck,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Mock orders data
export const mockOrders = [
  {
    id: "ord-001",
    customerId: "cust-001",
    purchaseId: "pur-001",
    date: "2023-05-15",
    status: "delivered",
    trackingNumber: "TRK18765432",
    deliveryDate: "2023-05-20",
    shippingAddress: "Infosys, Electronic City, Bangalore, Karnataka",
  },
  {
    id: "ord-002",
    customerId: "cust-001",
    purchaseId: "pur-002",
    date: "2023-06-10",
    status: "delivered",
    trackingNumber: "TRK29876543",
    deliveryDate: "2023-06-15",
    shippingAddress: "Infosys, Electronic City, Bangalore, Karnataka",
  },
  {
    id: "ord-003",
    customerId: "cust-002",
    purchaseId: "pur-003",
    date: "2023-06-20",
    status: "shipped",
    trackingNumber: "TRK37654321",
    deliveryDate: null,
    shippingAddress: "TCS, Whitefield, Bangalore, Karnataka",
  },
];

const OrderTracking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter orders based on search and status
  const filteredOrders = mockOrders.filter((order) => {
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Search query filter
    const customer = mockCustomers.find((c) => c.id === order.customerId);
    const customerName = customer ? customer.name.toLowerCase() : "";

    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber &&
        order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Count orders by status
  const statusCounts = {
    all: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    shipped: mockOrders.filter((o) => o.status === "shipped").length,
    delivered: mockOrders.filter((o) => o.status === "delivered").length,
    cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-indigo-500" />;
      case "delivered":
        return <Check className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getCustomerName = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer name, or tracking number..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders ({statusCounts.all})</SelectItem>
            <SelectItem value="pending">
              Pending ({statusCounts.pending})
            </SelectItem>
            <SelectItem value="processing">
              Processing ({statusCounts.processing})
            </SelectItem>
            <SelectItem value="shipped">
              Shipped ({statusCounts.shipped})
            </SelectItem>
            <SelectItem value="delivered">
              Delivered ({statusCounts.delivered})
            </SelectItem>
            <SelectItem value="cancelled">
              Cancelled ({statusCounts.cancelled})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "all" ? "bg-primary/10 border-primary" : "bg-white"
          }`}
          onClick={() => setStatusFilter("all")}
        >
          <p className="text-sm font-medium">All Orders</p>
          <p className="text-2xl font-bold">{statusCounts.all}</p>
        </div>
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "pending"
              ? "bg-yellow-50 border-yellow-400"
              : "bg-white"
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          <p className="text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold">{statusCounts.pending}</p>
        </div>
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "processing"
              ? "bg-blue-50 border-blue-400"
              : "bg-white"
          }`}
          onClick={() => setStatusFilter("processing")}
        >
          <p className="text-sm font-medium">Processing</p>
          <p className="text-2xl font-bold">{statusCounts.processing}</p>
        </div>
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "shipped"
              ? "bg-indigo-50 border-indigo-400"
              : "bg-white"
          }`}
          onClick={() => setStatusFilter("shipped")}
        >
          <p className="text-sm font-medium">Shipped</p>
          <p className="text-2xl font-bold">{statusCounts.shipped}</p>
        </div>
        <div
          className={`p-4 rounded-lg border cursor-pointer ${
            statusFilter === "delivered"
              ? "bg-green-50 border-green-400"
              : "bg-white"
          }`}
          onClick={() => setStatusFilter("delivered")}
        >
          <p className="text-sm font-medium">Delivered</p>
          <p className="text-2xl font-bold">{statusCounts.delivered}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Order Tracking</h3>
        {filteredOrders.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No orders found matching your criteria.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">Order #{order.id}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                          ? "bg-indigo-100 text-indigo-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {formatDate(order.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Customer: {getCustomerName(order.customerId)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Tracking Number: </span>
                    <span>{order.trackingNumber || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery Date: </span>
                    <span>{formatDate(order.deliveryDate)}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Shipping Address: </span>
                    <span>{order.shippingAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
