import React, { useState } from "react";
import {
  BarChart3,
  Package,
  Users,
  CreditCard,
  Settings,
  ShoppingBag,
  ChevronRight,
  Calendar,
  PieChart,
  ChevronLeft,
  LayoutDashboard,
  BarChart,
  ShoppingCart,
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import KeyMetricsSection from "./KeyMetricsSection";
import SalesTrendChart from "./charts/SalesTrendChart";
import StockLevelChart from "./charts/StockLevelChart";
import CategoryDistributionChart from "./charts/CategoryDistributionChart";
import PaymentStatusChart from "./charts/PaymentStatusChart";
import TopProductsChart from "./charts/TopProductsChart";
import PaymentManagement from "./PaymentManagement";
import CustomerManagement from "./customers/CustomerManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import PaymentManagementModule from "./payments/PaymentManagementModule";

export type TimeFilter = "day" | "week" | "month";

const AdminDashboard: React.FC = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>("week");
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Package className="h-5 w-5" />,
      subItems: [
        { id: "products", label: "Products" },
        { id: "categories", label: "Categories" },
        { id: "stock", label: "Stock Management" },
      ],
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "payments",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Payments",
      value: "payments",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
    // {
    //   id: "payment",
    //   label: "Payment",
    //   icon: <CreditCard className="h-5 w-5" />,
    //   subItems: [
    //     { id: "transactions", label: "Transaction Requests" },
    //     { id: "payments", label: "Payments History" },
    //   ],
    // },
  ];

  // Handle sidebar item click
  const handleSidebarItemClick = (id: string) => {
    if (activeSidebarItem === id) {
      setActiveSidebarItem("");
      setActiveSubItem(null);
    } else {
      setActiveSidebarItem(id);
      setActiveSubItem(null);
    }
  };

  // Handle sub-item click
  const handleSubItemClick = (id: string) => {
    setActiveSubItem(id);
  };

  // Mock data for metrics
  const metrics = {
    totalSales: { value: "₹245,600", change: "+12.5%", isPositive: true },
    averageOrder: { value: "₹3,456", change: "+5.2%", isPositive: true },
    pendingPayments: { value: "₹54,320", change: "-8.1%", isPositive: true },
    totalStock: { value: "1,245", change: "-3.4%", isPositive: false },
  };

  // Temporary components until the real ones are implemented
  const BestSellingProducts = ({ timeFilter }: { timeFilter: TimeFilter }) => (
    <div className="h-64 flex items-center justify-center text-slate-500">
      Best selling products will be shown here
    </div>
  );

  const PaymentDistributionChart = ({
    timeFilter,
  }: {
    timeFilter: TimeFilter;
  }) => (
    <div className="h-64 flex items-center justify-center text-slate-500">
      Payment distribution chart will be shown here
    </div>
  );

  const GrossProfitChart = ({ timeFilter }: { timeFilter: TimeFilter }) => (
    <div className="h-64 flex items-center justify-center text-slate-500">
      Gross profit chart will be shown here
    </div>
  );

  const TopCustomers = ({ timeFilter }: { timeFilter: TimeFilter }) => (
    <div className="h-64 flex items-center justify-center text-slate-500">
      Top customers will be shown here
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isSidebarExpanded ? (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold text-gray-800">AP</h1>
          )}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                !isSidebarExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <div
                  className={`flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors ${
                    activeSidebarItem === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSidebarItemClick(item.id)}
                >
                  <div className="mr-3">{item.icon}</div>
                  {isSidebarExpanded && (
                    <span className="flex-1">{item.label}</span>
                  )}
                  {isSidebarExpanded && item.subItems && (
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        activeSidebarItem === item.id ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>
                {isSidebarExpanded &&
                  item.subItems &&
                  activeSidebarItem === item.id && (
                    <ul className="mt-2 space-y-1 pl-6">
                      {item.subItems.map((subItem) => (
                        <li
                          key={subItem.id}
                          className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${
                            activeSubItem === subItem.id
                              ? "bg-blue-50 text-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleSubItemClick(subItem.id)}
                        >
                          {subItem.label}
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-10">
        {/* Dashboard Content based on active sidebar and sub item */}
        {activeSidebarItem === "dashboard" && (
          <>
            <DashboardHeader
              activeTimeFilter={activeTimeFilter}
              setActiveTimeFilter={setActiveTimeFilter}
            />

            <div className="p-6">
              <KeyMetricsSection timeFilter={activeTimeFilter} />

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                    Sales Trend Analysis
                  </h3>
                  <SalesTrendChart timeFilter={activeTimeFilter} />
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <Package className="mr-2 h-5 w-5 text-blue-500" />
                    Stock Level Monitoring
                  </h3>
                  <StockLevelChart />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <PieChart className="mr-2 h-5 w-5 text-indigo-500" />
                    Category Distribution
                  </h3>
                  <CategoryDistributionChart />
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <CreditCard className="mr-2 h-5 w-5 text-amber-500" />
                    Payment Status
                  </h3>
                  <PaymentStatusChart />
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <ShoppingBag className="mr-2 h-5 w-5 text-rose-500" />
                    Top Products
                  </h3>
                  <TopProductsChart />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <ShoppingBag className="mr-2 h-5 w-5 text-rose-500" />
                    Best-Selling Products
                  </h3>
                  <BestSellingProducts timeFilter={activeTimeFilter} />
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <PieChart className="mr-2 h-5 w-5 text-blue-500" />
                    Payment Distribution
                  </h3>
                  <PaymentDistributionChart timeFilter={activeTimeFilter} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <CreditCard className="mr-2 h-5 w-5 text-green-500" />
                    Gross Profit Margin
                  </h3>
                  <GrossProfitChart timeFilter={activeTimeFilter} />
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center text-lg font-medium">
                    <Users className="mr-2 h-5 w-5 text-teal-500" />
                    Top 5 Best Customers
                  </h3>
                  <TopCustomers timeFilter={activeTimeFilter} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Customer Management Content */}
        {activeSidebarItem === "customers" && <CustomerManagement />}

        {/* Payment Transaction Request Content */}
        {activeSidebarItem === "payment" &&
          activeSubItem === "transactions" && (
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-bold">Payment Management</h2>
              <PaymentManagement />
            </div>
          )}

        {/* Payment Management Module */}
        {activeSidebarItem === "payments" && <PaymentManagementModule />}
      </div>
    </div>
  );
};

export default AdminDashboard;
