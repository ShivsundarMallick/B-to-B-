import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.tsx";
import { Button } from "../../../components/ui/button";
import { ChevronDown, ChevronUp, Eye, FileText } from "lucide-react";
import { mockCustomers } from "./mockData";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Purchase {
  id: string;
  customerId: string;
  products: Product[];
  date: string;
  paymentMethod: string;
  status: string;
  total: number;
}

interface PurchaseHistoryTableProps {
  purchases: Purchase[];
}

const PurchaseHistoryTable: React.FC<PurchaseHistoryTableProps> = ({
  purchases,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
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

  const toggleRowExpanded = (purchaseId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(purchaseId)) {
      newExpandedRows.delete(purchaseId);
    } else {
      newExpandedRows.add(purchaseId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "3rem" }}></TableHead>
            <TableHead>Purchase ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No purchase history found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <React.Fragment key={purchase.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpanded(purchase.id)}
                    >
                      {expandedRows.has(purchase.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{purchase.id}</TableCell>
                  <TableCell>{getCustomerName(purchase.customerId)}</TableCell>
                  <TableCell>{formatDate(purchase.date)}</TableCell>
                  <TableCell>{purchase.paymentMethod}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : purchase.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {purchase.status.charAt(0).toUpperCase() +
                        purchase.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(purchase.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRows.has(purchase.id) && (
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={8} className="p-0">
                      <div className="p-4">
                        <h4 className="font-semibold mb-2">
                          Products in this purchase
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead className="text-right">
                                Unit Price
                              </TableHead>
                              <TableHead className="text-right">
                                Quantity
                              </TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {purchase.products.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">
                                  {product.name}
                                </TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(product.unitPrice)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {product.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(product.total)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-right font-semibold"
                              >
                                Grand Total:
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(purchase.total)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseHistoryTable;
