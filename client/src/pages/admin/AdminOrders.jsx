import React, { useState, useMemo } from "react";
import axios from "axios";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { useOrders } from "../../redux/ReduxProvider";
import OrderDetailsModal from "../../components/OrderDetailsModel";
import FilterModal from "../../components/AdminOrdersFilterModal";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{children}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className={`btn-primary ${confirmColor}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const initialFilterState = {
  search: "",
  paymentStatus: "all",
  paymentMethod: "all",
  deliveryStatus: "all",
  startDate: "",
  endDate: "",
};

const AdminOrders = () => {
  const [orders, setOrders] = useOrders();
  const [filters, setFilters] = useState(initialFilterState);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    orderId: null,
    action: null,
    updates: {},
  });
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters((prev) => ({ ...initialFilterState, search: prev.search }));
  };

  const updateOrderStatus = async (orderId, updates) => {
    const originalOrders = JSON.parse(JSON.stringify(orders));
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, ...updates } : order
      )
    );

    try {
      const payload = { orderId, updates };
      await axios.post(`${api}/order/updateOrder`, payload, {
        withCredentials: true,
      });
      toast.success("Order status updated!");
    } catch (error) {
      toast.error("Update failed. Reverting changes.");
      setOrders(originalOrders);
      console.error("Failed to update order:", error);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    const orderIdToDelete = orderToDelete._id;
    const originalOrders = JSON.parse(JSON.stringify(orders));

    setOrders((prev) => prev.filter((order) => order._id !== orderIdToDelete));
    setOrderToDelete(null); // Close the dialog immediately

    try {
      await axios.post(
        `${api}/order/delete`,
        { orderId: orderIdToDelete, userId: orderToDelete.user.userId },
        {
          withCredentials: true,
        }
      );
      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error("Deletion failed. Reverting changes.");
      setOrders(originalOrders);
      console.error("Failed to delete order:", error);
    }
  };

  const handleActionClick = (orderId, action, updates) => {
    setConfirmState({ isOpen: true, orderId, action, updates });
  };

  const confirmAction = async () => {
    const { orderId, updates } = confirmState;
    if (orderId && updates) {
      await updateOrderStatus(orderId, updates);
    }
    setConfirmState({
      isOpen: false,
      orderId: null,
      action: null,
      updates: {},
    });
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const {
        search,
        paymentStatus,
        paymentMethod,
        deliveryStatus,
        startDate,
        endDate,
      } = filters;

      if (paymentStatus !== "all" && order.paymentStatus !== paymentStatus)
        return false;
      if (paymentMethod !== "all" && order.paymentMethod !== paymentMethod)
        return false;
      if (deliveryStatus !== "all" && order.status !== deliveryStatus)
        return false;
      const searchMatch = search.toLowerCase();
      if (
        searchMatch &&
        !(
          order.user.name.toLowerCase().includes(searchMatch) ||
          order.user.phoneNumber?.includes(searchMatch)
        )
      ) {
        return false;
      }
      if (startDate || endDate) {
        const orderDateString = new Date(order.createdAt)
          .toISOString()
          .slice(0, 10);
        if (startDate && orderDateString < startDate) return false;
        if (endDate && orderDateString > endDate) return false;
      }
      return true;
    });
  }, [orders, filters]);

  const summary = useMemo(() => {
    if (!filteredOrders)
      return { totalPaid: 0, totalUnpaid: 0, notDeliveredCount: 0 };
    return filteredOrders.reduce(
      (acc, order) => {
        if (order.status !== "cancelled") {
          if (order.paymentStatus === "paid")
            acc.totalPaid += order.totalAmount;
          if (order.paymentStatus === "unpaid")
            acc.totalUnpaid += order.totalAmount;
        }
        if (order.status === "pending") acc.notDeliveredCount += 1;
        return acc;
      },
      { totalPaid: 0, totalUnpaid: 0, notDeliveredCount: 0 }
    );
  }, [filteredOrders]);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && value !== "all" && value !== ""
  ).length;

  if (orders === undefined) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="p-4 md:p-6 pb-24 lg:pb-6">
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={() => setFilterModalOpen(false)}
        onClear={clearFilters}
      />
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
      <ConfirmationDialog
        isOpen={confirmState.isOpen}
        onClose={() =>
          setConfirmState({
            isOpen: false,
            orderId: null,
            action: null,
            updates: {},
          })
        }
        onConfirm={confirmAction}
        title={`Confirm Order ${confirmState.action}`}
      >
        Are you sure you want to {confirmState.action?.toLowerCase()} this
        order?
      </ConfirmationDialog>
      <ConfirmationDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        title="Confirm Deletion"
        confirmText="Yes, Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      >
        Are you sure you want to permanently delete this order? This will also
        restock the items.
      </ConfirmationDialog>

      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search by Name/Phone..."
          value={filters.search}
          onChange={handleFilterChange}
          className="input-style flex-grow"
        />
        <button
          onClick={() => setFilterModalOpen(true)}
          className="btn-secondary relative flex-shrink-0"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="space-y-4 mb-20">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700"
            >
              <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                <div>
                  <p className="font-bold">{order.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {order.user.phoneNumber}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-bold text-lg">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                  <div className="flex gap-2 justify-end mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentMethod === "online"
                          ? "bg-cyan-100 text-cyan-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 flex flex-wrap gap-2 justify-between items-center">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View Details
                </button>
                <div className="flex gap-2">
                  {order.paymentStatus === "unpaid" && (
                    <button
                      onClick={() =>
                        handleActionClick(order._id, "Payment", {
                          paymentStatus: "paid",
                        })
                      }
                      className="btn-action bg-green-500 hover:bg-green-600"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        handleActionClick(order._id, "Delivery", {
                          status: "delivered",
                        })
                      }
                      className="btn-action bg-blue-500 hover:bg-blue-600"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <button
                        onClick={() =>
                          handleActionClick(order._id, "Cancellation", {
                            status: "cancelled",
                          })
                        }
                        className="btn-action bg-red-500 hover:bg-red-600"
                      >
                        Cancel Order
                      </button>
                    )}
                  {order.status !== "delivered" && (
                    <button
                      onClick={() => setOrderToDelete(order)}
                      className="btn-action bg-gray-500 hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">
            No orders match the current filters.
          </p>
        )}
      </div>

      <div className="fixed bottom-22 lg:bottom-0 left-0 lg:left-80 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t dark:border-gray-700 p-3 shadow-lg z-30">
        <div className="flex justify-around text-center text-sm font-semibold">
          <div>
            <span className="block text-green-500">Paid Total</span>
            <span>₹{summary.totalPaid.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-yellow-500">Unpaid Total</span>
            <span>₹{summary.totalUnpaid.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-blue-500">Pending Delivery</span>
            <span>{summary.notDeliveredCount} Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
