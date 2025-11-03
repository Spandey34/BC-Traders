const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onClear,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={onFilterChange}
            className="input-style"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={onFilterChange}
            className="input-style"
          >
            <option value="all">All Payment Modes</option>
            <option value="online">Online</option>
            <option value="cash">Cash</option>
          </select>
          <select
            name="deliveryStatus"
            value={filters.deliveryStatus}
            onChange={onFilterChange}
            className="input-style"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={onFilterChange}
              className="input-style"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={onFilterChange}
              className="input-style"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={onClear} className="btn-secondary">
            Clear Filters
          </button>
          <button
            onClick={onApply}
            className="btn-primary bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;