import React from "react";
import { Bell, Search } from "lucide-react";
import { TimeFilter } from "./AdminDashboard";

interface DashboardHeaderProps {
  activeTimeFilter: TimeFilter;
  setActiveTimeFilter: (filter: TimeFilter) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeTimeFilter,
  setActiveTimeFilter,
}) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-4">
          {/* Time Filters Toggle */}
          <div className="flex rounded-lg border bg-gray-50 p-1">
            <button
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                activeTimeFilter === "day"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTimeFilter("day")}
            >
              Day
            </button>
            <button
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                activeTimeFilter === "week"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTimeFilter("week")}
            >
              Week
            </button>
            <button
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                activeTimeFilter === "month"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTimeFilter("month")}
            >
              Month
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 rounded-md border border-gray-300 pl-9 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-500">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>

      {/* Sub-heading with current date range */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-500">
            {activeTimeFilter === "day" && "Today's Overview"}
            {activeTimeFilter === "week" && "This Week's Overview"}
            {activeTimeFilter === "month" && "This Month's Overview"}
            <span className="ml-2 text-xs font-normal">
              {activeTimeFilter === "day" && new Date().toLocaleDateString()}
              {activeTimeFilter === "week" &&
                `${new Date(
                  new Date().setDate(new Date().getDate() - new Date().getDay())
                ).toLocaleDateString()} - ${new Date(
                  new Date().setDate(
                    new Date().getDate() - new Date().getDay() + 6
                  )
                ).toLocaleDateString()}`}
              {activeTimeFilter === "month" &&
                new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
            </span>
          </h2>
          <div className="text-sm font-medium text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
