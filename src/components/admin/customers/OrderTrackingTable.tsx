import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  Package,
  Truck,
  Check,
  AlertTriangle,
  Clock,
  Send,
  Bell,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { mockCustomers } from "./CustomerManagement";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface Order {
  id: string;
  customerId: string;
  purchaseId: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber: string | null;
  deliveryDate: string | null;
  shippingAddress: string;
}

interface OrderTrackingTableProps {
  orders: Order[];
}

const OrderTrackingTable: React.FC<OrderTrackingTableProps> = ({ orders }) => {
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [sendNotification, setSendNotification] = useState(true);

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateStatus = () => {
    if (!updatingOrder || !updatedStatus) return;

    console.log(
      `Updating order ${updatingOrder.id} status to ${updatedStatus}`
    );
    console.log(`Send notification: ${sendNotification}`);

    // In a real application, this would call an API to update the status
    // and potentially send a notification to the customer

    setUpdatingOrder(null);
    setUpdatedStatus("");
  };

  const openUpdateDialog = (order: Order) => {
    setUpdatingOrder(order);
    setUpdatedStatus(order.status);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No orders found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{getCustomerName(order.customerId)}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(order.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{order.trackingNumber || "—"}</TableCell>
                <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateDialog(order)}
                          >
                            Update Status
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Update order status and notify customer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Update Status Dialog */}
      <Dialog
        open={Boolean(updatingOrder)}
        onOpenChange={(open) => {
          if (!open) setUpdatingOrder(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {updatingOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Order ID
                    </p>
                    <p className="font-medium">{updatingOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Customer
                    </p>
                    <p>{getCustomerName(updatingOrder.customerId)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">
                    Current Status
                  </label>
                  <div className="flex items-center gap-1.5 mt-1">
                    {getStatusIcon(updatingOrder.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        updatingOrder.status
                      )}`}
                    >
                      {updatingOrder.status.charAt(0).toUpperCase() +
                        updatingOrder.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500 mb-1.5 block">
                    Update Status
                  </label>
                  <Select
                    value={updatedStatus}
                    onValueChange={setUpdatedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendNotification"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="sendNotification"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                  >
                    <Bell className="h-4 w-4 text-gray-400" />
                    Send notification to customer
                  </label>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setUpdatingOrder(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateStatus}
                    className="flex items-center gap-1.5"
                    disabled={updatedStatus === updatingOrder.status}
                  >
                    <Send className="h-4 w-4" />
                    Update
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTrackingTable;
