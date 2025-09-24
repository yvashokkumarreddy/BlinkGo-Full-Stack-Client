import { useState } from "react";
import Axios from "../utils/Axios";

const ShippingFormModal = ({
  isOpen,
  onClose,
  orderId,
  product_details,
  deliveryDate,
  onShippingComplete,
  onConfirm,
}) => {
  const [form, setForm] = useState({
    carrierService: "USPS",
    serviceType: "Priority Mail",
    packageName: "Personal Box",
    packageType: "Box",
    weight: 1,
    dimensions: { length: 10, width: 10, height: 10 },
    subtotal: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["length", "width", "height"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [name]: Number(value) },
      }));
    } else if (name === "weight") {
      setForm((prev) => ({ ...prev, weight: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Calculate totals
      const subtotal = product_details.reduce((acc, item) => {
        const price = item.product?.price || 0;
        const discount = item.product?.discount || 0;
        const quantity = item.quantity || 1;
        return acc + (price - (price * discount) / 100) * quantity;
      }, 0);

      const total =
        subtotal +
        5 +
        form.weight * 1.5 +
        (form.dimensions.length * form.dimensions.width * form.dimensions.height) /
          5000;

      const payload = {
        orderId,
        carrierService: form.carrierService,
        serviceType: form.serviceType,
        packageName: form.packageName,
        packageType: form.packageType,
        weight: form.weight,
        dimensions: form.dimensions,
        subtotal,
        total,
        products: product_details.map((item) => ({
          productId: item.product?._id,
          quantity: item.quantity,
        })),
        deliveryDate: deliveryDate || new Date(),
      };

      const res = await Axios.post("/order/create-label", payload);

      if (res.data?.shippingLabel) {
        onShippingComplete(res.data.shippingLabel); // Update parent state
        onConfirm(deliveryDate || new Date()); // Update order status
        onClose();
      } else {
        alert("Failed to create shipping label");
      }
    } catch (err) {
      console.error("Error creating shipping label:", err);
      alert("Error creating shipping label");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 overflow-y-auto pt-10">
      <div className="bg-white shadow-lg relative rounded w-4/5 max-w-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Carrier Service</label>
            <input
              type="text"
              name="carrierService"
              value={form.carrierService}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Service Type</label>
            <input
              type="text"
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Package Name</label>
            <input
              type="text"
              name="packageName"
              value={form.packageName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Package Type</label>
            <input
              type="text"
              name="packageType"
              value={form.packageType}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium">Length (cm)</label>
              <input
                type="number"
                name="length"
                value={form.dimensions.length}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Width (cm)</label>
              <input
                type="number"
                name="width"
                value={form.dimensions.width}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={form.dimensions.height}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating Label..." : "Create Shipping Label"}
        </button>
      </div>
    </div>
  );
};

export default ShippingFormModal;
