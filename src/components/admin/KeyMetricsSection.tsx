import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  RotateCcw,
  // Users,
  // Percent,
} from "lucide-react";
import { TimeFilter } from "./AdminDashboard";

interface KeyMetricCardProps {
  title: string;
  value: string | number;
  changeValue: number;
  changeText: string;
  icon: React.ReactNode;
  trendUp?: boolean;
}

const KeyMetricCard: React.FC<KeyMetricCardProps> = ({
  title,
  value,
  changeValue,
  changeText,
  icon,
  trendUp,
}) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-bold">{value}</p>
            <span
              className={`ml-2 text-xs font-medium ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="flex items-center">
                {trendUp ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {changeValue}%
              </span>
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">{changeText}</p>
        </div>
        <div
          className={`rounded-full p-3 ${
            trendUp
              ? "bg-green-100 text-green-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

interface KeyMetricsSectionProps {
  timeFilter: TimeFilter;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({
  timeFilter,
}) => {
  // Mock data - In a real application, this would be fetched from an API
  const getMetricsData = () => {
    switch (timeFilter) {
      case "day":
        return {
          orders: {
            value: 157,
            change: 12.3,
            trendUp: true,
            changeText: "from yesterday",
          },
          revenue: {
            value: "$8,547",
            change: 8.7,
            trendUp: true,
            changeText: "from yesterday",
          },
          returnRate: {
            value: "3.2%",
            change: 0.5,
            trendUp: false,
            changeText: "from yesterday",
          },
          suppliers: {
            value: 24,
            change: 0,
            trendUp: true,
            changeText: "no change",
          },
        };
      case "week":
        return {
          orders: {
            value: 843,
            change: 5.6,
            trendUp: true,
            changeText: "from last week",
          },
          revenue: {
            value: "$42,899",
            change: 6.8,
            trendUp: true,
            changeText: "from last week",
          },
          returnRate: {
            value: "2.8%",
            change: 0.3,
            trendUp: false,
            changeText: "from last week",
          },
          suppliers: {
            value: 24,
            change: 4.2,
            trendUp: true,
            changeText: "from last week",
          },
        };
      case "month":
        return {
          orders: {
            value: 3452,
            change: 3.2,
            trendUp: true,
            changeText: "from last month",
          },
          revenue: {
            value: "$175,680",
            change: 4.5,
            trendUp: true,
            changeText: "from last month",
          },
          returnRate: {
            value: "2.5%",
            change: 0.2,
            trendUp: false,
            changeText: "from last month",
          },
          suppliers: {
            value: 26,
            change: 8.3,
            trendUp: true,
            changeText: "from last month",
          },
        };
    }
  };

  const metricsData = getMetricsData();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KeyMetricCard
        title="Order Count"
        value={metricsData.orders.value}
        changeValue={metricsData.orders.change}
        changeText={metricsData.orders.changeText}
        icon={<Package className="h-6 w-6" />}
        trendUp={metricsData.orders.trendUp}
      />
      <KeyMetricCard
        title="Revenue Generated"
        value={metricsData.revenue.value}
        changeValue={metricsData.revenue.change}
        changeText={metricsData.revenue.changeText}
        icon={<DollarSign className="h-6 w-6" />}
        trendUp={metricsData.revenue.trendUp}
      />
      <KeyMetricCard
        title="Product Return Rate"
        value={metricsData.returnRate.value}
        changeValue={metricsData.returnRate.change}
        changeText={metricsData.returnRate.changeText}
        icon={<RotateCcw className="h-6 w-6" />}
        trendUp={metricsData.returnRate.trendUp}
      />
      <KeyMetricCard
        title="Supplier Count"
        value={metricsData.suppliers.value}
        changeValue={metricsData.suppliers.change}
        changeText={metricsData.suppliers.changeText}
        icon={<Truck className="h-6 w-6" />}
        trendUp={metricsData.suppliers.trendUp}
      />
    </div>
  );
};

export default KeyMetricsSection;
