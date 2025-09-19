import { FaClipboardList, FaClipboardCheck, FaShippingFast, FaTruck, FaHome } from "react-icons/fa";

const steps = [
  { key: "Pending", label: "Order Placed", icon: <FaClipboardList />, color: "text-purple-500" },
  { key: "confirmed", label: "Order Confirmed", icon: <FaClipboardCheck />, color: "text-blue-500" },
  { key: "shipped", label: "Order Shipped", icon: <FaShippingFast />, color: "text-yellow-500" },
  { key: "out", label: "Out for Delivery", icon: <FaTruck />, color: "text-green-500" },
  { key: "delivered", label: "Order Delivered", icon: <FaHome />, color: "text-green-700" },
];

// This should match exactly with your backend status values
const statusOrder = ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

const OrderProgress = ({ currentStatus }) => {
  const currentStepIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      {/* Progress Line */}
      <div className="relative flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex-1 relative">
            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-1/2 left-1/2 w-full h-1 -translate-y-1/2 ${
                  index < currentStepIndex ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}

            {/* Step Circle */}
            <div
              className={`relative z-10 w-10 h-10 mx-auto flex items-center justify-center rounded-full border-2 ${
                index <= currentStepIndex
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-200 text-gray-500 border-gray-300"
              }`}
            >
              {step.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center text-center w-1/5">
            <div className={`${index <= currentStepIndex ? step.color : "text-gray-500"}`}>
              {step.icon}
            </div>
            <p className="text-sm mt-2">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderProgress;
