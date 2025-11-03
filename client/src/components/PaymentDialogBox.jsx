const PaymentDialog = ({ isOpen, onClose, onSelectPayment }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
                <h3 className="text-xl font-bold mb-4">Choose Payment Method</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">How would you like to pay for your order?</p>
                <div className="space-y-3">
                    <button 
                        onClick={() => onSelectPayment('online')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Pay Online
                    </button>
                    <button 
                        onClick={() => onSelectPayment('cash')}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Pay with Cash (COD)
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full text-gray-500 dark:text-gray-400 py-2 mt-2 rounded-lg hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDialog;