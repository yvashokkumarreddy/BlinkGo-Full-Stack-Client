import { useState } from "react";
import Axios from "../utils/Axios";

const ShippingFormModal = ({
  isOpen,
  onClose,
  orderId,
  product_details = [],
  onShippingComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    carrier: "USPS",
    serviceType: "Priority Mail",
    packageName: "Personal Box",
    packageType: "Box",
    weight: 2.5,
    dimensions: { length: 45, width: 35, height: 15 },
    deliveryDate: "",
    returnAddress: {
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [name]: value },
    }));
  };

  const handleReturnAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      returnAddress: { ...prev.returnAddress, [name]: value },
    }));
  };

  const calculateShippingCost = () => {
    const base = 5.0;
    const weightCost = form.weight * 1.5;
    const sizeFactor =
      (form.dimensions.length * form.dimensions.width * form.dimensions.height) /
      5000;
    return base + weightCost + sizeFactor;
  };

  const calculateProductTotal = () => {
    if (!Array.isArray(product_details) || product_details.length === 0)
      return 0;

    const totalWithoutDiscount = product_details.reduce(
      (sum, item) =>
        sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    const totalDiscount = product_details.reduce(
      (sum, item) =>
        sum +
        ((item.product?.price || 0) * (item.product?.discount || 0)) / 100 *
          (item.quantity || 1),
      0
    );

    return totalWithoutDiscount - totalDiscount;
  };

  const calculateTotal = () => {
    const productTotal = calculateProductTotal();
    const shippingCost = calculateShippingCost();
    return (productTotal + shippingCost).toFixed(2);
  };

  const handleBuyLabel = async () => {
    setLoading(true);
    try {
      const subtotal = calculateTotal();
      const total = subtotal;
      const trackingNumber = `TRK-${Date.now()}`;

      const products = product_details.map((item) => ({
        name: item.product?.name,
        price: item.product?.price,
        quantity: item.quantity,
      }));

      const response = await Axios.post("/order/create-shipping-label", {
        orderId,
        carrierService: form.carrier,
        serviceType: form.serviceType,
        packageName: form.packageName,
        packageType: form.packageType,
        weight: form.weight,
        dimensions: form.dimensions,
        subtotal,
        total,
        trackingNumber,
        deliveryDate: form.deliveryDate,
        returnAddress: form.returnAddress,
        products,
      });

      alert("Shipping label created successfully!");

      if (onShippingComplete) onShippingComplete(response.data.shippingLabel);

      await Axios.post("/order/update-status", {
        orderId,
        status: "Shipped",
        deliveryDate: form.deliveryDate || new Date(),
      });

      onClose();
    } catch (err) {
      console.error("Error creating shipping label:", err);
      alert(err.response?.data?.message || "Error creating shipping label");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  // console.log("product details", product_details)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-1/2 h-full shadow-lg p-6 overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-6">Create Shipping Label</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* LEFT SIDE – Order Details */}
          <div className="border-r pr-4">
            <h3 className="font-semibold mb-3">Order Details</h3>
            <p className="text-sm mb-2">Order ID: {orderId}</p>
            <p className="text-sm mb-2 font-semibold">Products:</p>
            <div className="space-y-2 mb-4">
              {product_details.map((item, idx) => (
                <div key={idx} className="text-sm border rounded p-2 flex justify-between">
                <div>
                  <p>{item.product?.name}</p>
                  <p>Price: ₹{item.product?.price}</p>
                </div>
                  <img src={item.product?.image[0]} className="w-10" />
                </div>
              ))}
            </div>

            <p className="text-sm font-semibold">
              Total Items: {product_details.length}
            </p>
            {Array.isArray(product_details) &&
              product_details.length > 0 &&
              (() => {
                const totalWithoutDiscount = product_details.reduce(
                  (sum, item) =>
                    sum + (item.product?.price || 0) * (item.quantity || 1),
                  0
                );
                const totalDiscount = product_details.reduce(
                  (sum, item) =>
                    sum +
                    ((item.product?.price || 0) * (item.product?.discount || 0)) /
                      100 *
                      (item.quantity || 1),
                  0
                );
                const finalTotal = totalWithoutDiscount - totalDiscount;
                return (
                  <>
                    <p>
                      <span className="font-semibold">
                        Total (Without Discount):
                      </span>{" "}
                      ₹{totalWithoutDiscount.toFixed(2)}
                    </p>
                    <p className="text-red-600">
                      <span className="font-semibold">Discount:</span> -₹
                      {totalDiscount.toFixed(2)}
                    </p>
                    <p className="text-green-600 font-bold">
                      <span className="font-semibold">Final Total:</span> ₹
                      {finalTotal.toFixed(2)}
                    </p>
                  </>
                );
              })()}
          </div>

          {/* RIGHT SIDE – Shipping Form */}
          <div>
            <h3 className="font-semibold mb-3">Shipping Info</h3>

            {/* Carrier */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Carrier</label>
              <select
                name="carrier"
                value={form.carrier}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="USPS">USPS</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
              </select>
            </div>

            {/* Service Type */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Service Type</label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="Priority Mail">Priority Mail</option>
                <option value="Express">Express</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            {/* Package */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Package Name</label>
              <input
                type="text"
                name="packageName"
                value={form.packageName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Package Type</label>
              <select
                name="packageType"
                value={form.packageType}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="Box">Box</option>
                <option value="Envelope">Envelope</option>
              </select>
            </div>

            {/* Weight */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            {/* Dimensions */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Dimensions (cm)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="length"
                  value={form.dimensions.length}
                  onChange={handleDimensionChange}
                  className="w-1/3 border rounded px-2 py-1"
                />
                <input
                  type="number"
                  name="width"
                  value={form.dimensions.width}
                  onChange={handleDimensionChange}
                  className="w-1/3 border rounded px-2 py-1"
                />
                <input
                  type="number"
                  name="height"
                  value={form.dimensions.height}
                  onChange={handleDimensionChange}
                  className="w-1/3 border rounded px-2 py-1"
                />
              </div>
            </div>

            {/* ✅ Return Address */}
            {/* <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-3">Return Address</h3>
              {["name", "street", "city", "state", "zip", "country"].map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm font-medium capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={form.returnAddress[field]}
                    onChange={handleReturnAddressChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div> */}

            {/* Summary */}
            <div className="border-t pt-3 mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Shipping Charges:</span> ₹
                {calculateShippingCost().toFixed(2)}
              </p>
              <p className="font-semibold text-lg">
                <span className="font-semibold">Final Total:</span> ₹
                {calculateTotal()}
              </p>
              <button
                onClick={handleBuyLabel}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                {loading ? "Processing..." : "Buy Shipping Label"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingFormModal;
