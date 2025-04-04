import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, UserPlus, FileText, Download } from "lucide-react";
import CustomerProfileList from "./CustomerProfileList.tsx";
import CustomerDetails from "./CustomerDetails";
import PurchaseHistory from "./PurchaseHistory.tsx";
import OrderTracking from "./OrderTracking";
import PaymentManagement from "./PaymentManagement";

// Mock Customers Data (temporary until API is integrated)
export const mockCustomers = [
  {
    id: "cust-001",
    name: "Rajat Sharma",
    email: "rajat.sharma@infosys.com",
    phone: "+91 9876543210",
    address: "Infosys, Electronic City, Bangalore, Karnataka",
    registrationDate: "2023-01-15",
    lastLogin: "2023-07-25T08:30:00",
    status: "active" as const,
    company: "Infosys Ltd.",
  },
  {
    id: "cust-002",
    name: "Priya Patel",
    email: "priya.patel@tcs.com",
    phone: "+91 8765432109",
    address: "TCS, Whitefield, Bangalore, Karnataka",
    registrationDate: "2023-02-20",
    lastLogin: "2023-07-24T14:45:00",
    status: "active" as const,
    company: "Tata Consultancy Services",
  },
  {
    id: "cust-003",
    name: "Vikram Singh",
    email: "vikram.singh@wipro.com",
    phone: "+91 7654321098",
    address: "Wipro Campus, Sarjapur Road, Bangalore, Karnataka",
    registrationDate: "2023-03-05",
    lastLogin: "2023-07-20T11:15:00",
    status: "inactive" as const,
    company: "Wipro Limited",
  },
];

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  lastLogin: string;
  status: "active" | "inactive";
  company: string;
};

const CustomerManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("profiles");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [_showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Management
        </h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddCustomerModal(true)}
        >
          <UserPlus size={16} />
          <span>Add Customer</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Export CSV</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {selectedCustomer ? (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedCustomer(null)}
            className="mb-4"
          >
            ← Back to customer list
          </Button>
          <CustomerDetails
            customer={selectedCustomer}
            onBack={() => setSelectedCustomer(null)}
          />
        </div>
      ) : (
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="bg-white rounded-lg shadow-sm"
        >
          <TabsList className="p-1 m-4 bg-gray-100">
            <TabsTrigger value="profiles">Customer Profiles</TabsTrigger>
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
            <TabsTrigger value="orders">Order Tracking</TabsTrigger>
            <TabsTrigger value="payments">Payments & Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="p-4 pt-0">
            <CustomerProfileList
              customers={filteredCustomers}
              onSelectCustomer={setSelectedCustomer}
            />
          </TabsContent>

          <TabsContent value="purchases" className="p-4 pt-0">
            <PurchaseHistory />
          </TabsContent>

          <TabsContent value="orders" className="p-4 pt-0">
            <OrderTracking />
          </TabsContent>

          <TabsContent value="payments" className="p-4 pt-0">
            <PaymentManagement />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CustomerManagement;
