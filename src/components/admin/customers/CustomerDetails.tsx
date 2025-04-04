import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building,
} from "lucide-react";
import { Customer } from "./CustomerManagement";
import { mockPurchases } from "./PurchaseHistory";
import { mockOrders } from "./OrderTracking";
import { mockPayments } from "./PaymentInvoiceTable.tsx";

interface CustomerDetailsProps {
  customer: Customer;
  onBack: () => void;
}

// Simple implementation of the tables used in details tabs
const PurchaseHistoryTable = ({ purchases }: { purchases: any[] }) => (
  <div className="border rounded p-4">
    <p className="text-center">{purchases.length} purchases found</p>
  </div>
);

const OrderTrackingTable = ({ orders }: { orders: any[] }) => (
  <div className="border rounded p-4">
    <p className="text-center">{orders.length} orders found</p>
  </div>
);

const PaymentInvoiceTable = ({ payments }: { payments: any[] }) => (
  <div className="border rounded p-4">
    <p className="text-center">{payments.length} payments found</p>
  </div>
);

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  // onBack,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer>({
    ...customer,
  });

  const customerPurchases = mockPurchases.filter(
    (p) => p.customerId === customer.id
  );
  const customerOrders = mockOrders.filter((o) => o.customerId === customer.id);
  const customerPayments = mockPayments.filter(
    (p) => p.customerId === customer.id
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real application, this would send the updated data to an API
    console.log("Saving customer data:", editedCustomer);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary h-14 w-14 rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <p className="text-gray-500">{customer.company}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="p-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedCustomer.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={editedCustomer.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={editedCustomer.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={editedCustomer.company}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p>{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p>{customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Company
                        </p>
                        <p>{customer.company}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge
                        variant={
                          customer.status === "active" ? "success" : "secondary"
                        }
                      >
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={editedCustomer.address}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Shipping Address
                      </p>
                      <p>{customer.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Registration Date
                      </p>
                      <p>{formatDate(customer.registrationDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Login
                      </p>
                      <p>{formatDateTime(customer.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                All purchases made by {customer.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseHistoryTable purchases={customerPurchases} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>
                Track all orders for {customer.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTrackingTable orders={customerOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payments & Invoices</CardTitle>
              <CardDescription>
                Payment history and invoice management for {customer.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentInvoiceTable payments={customerPayments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
