import React, { useState } from "react";
import { mockCustomers } from "./CustomerManagement";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { FileDown, Search } from "lucide-react";

// Mock purchase data
export const mockPurchases = [
  {
    id: "pur-001",
    customerId: "cust-001",
    products: [
      {
        id: "prod-1",
        name: "Dell Latitude Laptop",
        sku: "LAP-DEL-001",
        quantity: 5,
        unitPrice: 78000,
        total: 390000,
      },
      {
        id: "prod-2",
        name: "HP Monitor 24-inch",
        sku: "MON-HP-001",
        quantity: 10,
        unitPrice: 12000,
        total: 120000,
      },
    ],
    date: "2023-05-15",
    paymentMethod: "Corporate Credit Card",
    status: "completed",
    total: 510000,
  },
  {
    id: "pur-002",
    customerId: "cust-001",
    products: [
      {
        id: "prod-3",
        name: "Logitech Wireless Keyboard",
        sku: "KEY-LOG-001",
        quantity: 20,
        unitPrice: 1500,
        total: 30000,
      },
    ],
    date: "2023-06-10",
    paymentMethod: "Bank Transfer",
    status: "completed",
    total: 30000,
  },
];

const PurchaseHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter purchases based on search and customer
  const filteredPurchases = mockPurchases.filter((purchase) => {
    // Customer filter
    if (
      selectedCustomer !== "all" &&
      purchase.customerId !== selectedCustomer
    ) {
      return false;
    }

    // Search in products
    const matchesSearch = purchase.products.some(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get customer name
    const customer = mockCustomers.find((c) => c.id === purchase.customerId);
    const customerName = customer ? customer.name.toLowerCase() : "";

    return (
      matchesSearch ||
      customerName.includes(searchQuery.toLowerCase()) ||
      purchase.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate totals
  const totalAmount = filteredPurchases.reduce(
    (sum, purchase) => sum + purchase.total,
    0
  );
  const totalPurchases = filteredPurchases.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by product, SKU, or customer..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {mockCustomers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Total Purchases</p>
          <p className="text-2xl font-bold">{totalPurchases}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm font-medium text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Purchase History</h3>
        {filteredPurchases.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No purchase history found matching your criteria.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => {
              const customer = mockCustomers.find(
                (c) => c.id === purchase.customerId
              );
              return (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">Order #{purchase.id}</span>
                      <span className="text-gray-500 ml-3">
                        {new Date(purchase.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(purchase.total)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Customer: {customer?.name || "Unknown"}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Products:</p>
                    <ul className="text-sm">
                      {purchase.products.map((product) => (
                        <li
                          key={product.id}
                          className="flex justify-between py-1"
                        >
                          <span>
                            {product.name} × {product.quantity}
                          </span>
                          <span>{formatCurrency(product.total)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
