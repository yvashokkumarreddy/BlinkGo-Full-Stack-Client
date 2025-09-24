import { useState } from "react";

const ConfirmPopup = ({ order, user, productDetails, onClose, onConfirm }) => {
  const [deliveryDate, setDeliveryDate] = useState("");

  // ✅ Calculate product total
  const calculateProductTotal = () => {
    if (!Array.isArray(productDetails) || productDetails.length === 0) return 0;

    const totalWithoutDiscount = productDetails.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );

    const totalDiscount = productDetails.reduce(
      (sum, item) =>
        sum +
        (((item.product?.price || 0) * (item.product?.discount || 0)) / 100) *
          (item.quantity || 1),
      0
    );

    return totalWithoutDiscount - totalDiscount;
  };

  const handleConfirm = () => {
    if (!deliveryDate) {
      alert("⚠ Please select a delivery date before confirming the order.");
      return;
    }
    onConfirm(deliveryDate); // pass selected delivery date back
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Confirm Order</h2>

        {/* ✅ Order Summary */}
        <div className="mb-4">
          <p>
            <span className="font-semibold">Order ID:</span> {order.order_Id}
          </p>
          <p>
            <span className="font-semibold">Customer:</span>{" "}
            {user?.name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Total Amount:</span> ₹
            {calculateProductTotal().toFixed(2)}
          </p>
        </div>

        {/* ✅ Products */}
        <div className="mb-4 border p-2 rounded space-y-2">
          <h3 className="font-semibold">Products:</h3>
          {Array.isArray(productDetails) && productDetails.length > 0 ? (
            productDetails.map((item, idx) => (
              <div key={idx} className="text-sm border-b pb-2 last:border-b-0">
                <p className="font-medium">{item.product?.name}</p>
                <p className="text-gray-600">
                  Price: ₹{item.product?.price} | Qty: {item.quantity} | Discount:{" "}
                  {item.product?.discount || 0}%
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No products found.</p>
          )}
        </div>

        {/* ✅ Delivery Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select Delivery Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full border rounded px-2 py-1"
            min={new Date().toISOString().split("T")[0]} // today or later
          />
        </div>

        {/* ✅ Action Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
