import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaClipboardList, FaDollarSign, FaExclamationTriangle, FaUserPlus, FaUsers } from 'react-icons/fa';
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from "axios";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    products: [],
    revenueData: [],
    categoryData: [],
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      newCustomers: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersRes = await axios.get("http://localhost:3001/api/v1/orders");
        const orders = ordersRes.data;

        // Fetch products
        const productsRes = await axios.get("http://localhost:3001/api/v1/products");
        const products = productsRes.data;

        // Calculate statistics
        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.packageId?.price * order.quantity || 0);
        }, 0);

        const confirmedOrders = orders.filter(order => order.status === "confirmed");
        const pendingOrders = orders.filter(order => order.status === "pending");

        // Generate revenue data (last 6 months)
        const revenueData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months.forEach((month, index) => {
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getMonth() === index;
          });
          const monthRevenue = monthOrders.reduce((sum, order) => {
            return sum + (order.packageId?.price * order.quantity || 0);
          }, 0);
          revenueData.push({ month, revenue: monthRevenue });
        });

        // Generate category data
        const categoryData = [];
        const categories = {};
        products.forEach(product => {
          const category = product.category || 'Other';
          categories[category] = (categories[category] || 0) + 1;
        });
        Object.entries(categories).forEach(([name, value]) => {
          categoryData.push({ name, value });
        });

        // Get recent orders (last 5)
        const recentOrders = orders.slice(0, 5).map(order => ({
          id: order._id,
          customer: order.customerId?.fname || order.fullName || "Guest",
          product: order.packageId?.name || "Product",
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          amount: `₹${(order.packageId?.price * order.quantity) || 0}`
        }));

        setDashboardData({
          orders,
          products,
          revenueData,
          categoryData,
          recentOrders,
          stats: {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            newCustomers: orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              const now = new Date();
              const diffDays = Math.ceil((now - orderDate) / (1000 * 60 * 60 * 24));
              return diffDays <= 7;
            }).length
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh dashboard data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusPill = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "canceled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${dashboardData.stats.totalRevenue.toLocaleString()}`} icon={<FaDollarSign size={24} />} color="text-green-500" />
        <StatCard title="Total Orders" value={dashboardData.stats.totalOrders.toString()} icon={<FaClipboardList size={24} />} color="text-blue-500" />
        <StatCard title="Total Products" value={dashboardData.stats.totalProducts.toString()} icon={<FaBoxOpen size={24} />} color="text-purple-500" />
        <StatCard title="New Customers" value={dashboardData.stats.newCustomers.toString()} icon={<FaUserPlus size={24} />} color="text-yellow-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Product Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dashboardData.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">ORDER ID</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">CUSTOMER</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">AMOUNT</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Summary */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaClipboardList className="mr-3 text-blue-500" /> Order Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-semibold text-red-800">Cancelled Orders</span>
              <span className="text-lg font-bold text-red-600">
                {dashboardData.orders.filter(order => order.status === "cancelled").length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-800">Total Orders</span>
              <span className="text-lg font-bold text-blue-600">
                {dashboardData.orders.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-xl hover:scale-105 transition-all">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-4 rounded-full bg-gray-100 ${color}`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
