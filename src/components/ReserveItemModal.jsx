// import React from "react";

const ReserveItemModal = ({ isOpen, onClose, products, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Reserve Items</h2>
        <p className="text-sm text-gray-500 mb-4">
          Reserve your items now to secure them for 24 hours. Limited stock available!
        </p>

        {/* Reserve Until */}
        <label className="text-sm font-medium">Reserve Until</label>
        <input
          type="date"
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-4"
        />

        {/* Stock List */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Available Stock</h3>
          {products?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border rounded-lg p-2 mb-2"
            ><div className="flex-col">
              <span>{item.product_details.name}</span>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p></div>
              <span className="text-gray-500">{item.stock} available</span>
            </div>
            
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveItemModal;
