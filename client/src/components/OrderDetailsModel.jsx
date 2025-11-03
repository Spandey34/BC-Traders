const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="space-y-2 border-t border-b py-4 my-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {item.name} (₹{item.price.toFixed(2)}) x {item.quantity}
              </p>
              <p className="font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center font-bold text-lg">
          <p>Total</p>
          <p>₹{order.totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;