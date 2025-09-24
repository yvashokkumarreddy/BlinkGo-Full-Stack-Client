import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import OrderProgress from "../components/OrderProgress";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
// import profile from "../assets/profile.png";
import { CgProfile } from "react-icons/cg";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaBuilding, FaGlobe } from "react-icons/fa";
import ShippingLabelModal from "../popUps/ShippingLabelModal";

const UserOrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.order_Id;
  const userId = location.state?.user_id;
  const count = location.state?.len || 0;
console.log("location", location)
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shippingLabel, setShippingLabel] = useState(null);
  const [openLabel, setOpenLabel] = useState(false);

  // Fetch order details
  console.log("ashok teady")
  useEffect(() => {
    const fetchOrder = async () => {
        console.log("inside fetchorder()")
      try {
        setLoading(true);
        const res = await Axios({
          ...SummaryApi.getOrderById,
          data: { orderId, userId },
        });
        console.log("ashna",res)
        setOrderData(res.data);
        // if (res.data?.shippingLabel) {
        //   setShippingLabel(res.data.shippingLabel);
        // }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId && userId) fetchOrder();
  }, [orderId, userId]);

  // Fetch shipping label from backend
  const fetchShippingLabel = async () => {
    if (!orderId) return;
    try {
      const res = await Axios.post("/order/get-label", { orderId });
      console.log("ressss",res)
      if (res.data?.data) {
        setShippingLabel(res.data.data);
        setOpenLabel(true);
      } else {
        alert("No shipping label found for this order");
      }
    } catch (err) {
      console.error("Error fetching shipping label:", err);
      alert("Error fetching shipping label details");
    }
  };

//   if (loading) return <p className="p-6">Loading order details...</p>;
if (loading)
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-50">
      <svg
        className="animate-spin h-12 w-12 text-blue-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-lg font-medium text-gray-700">
        Loading order details...
      </p>
    </div>
  );


  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!orderData) return <p className="p-6 text-red-600">No order selected.</p>;
// console.log(shippingLabel.deiverydate)
  const { order, user, product_details, shippingLabelDetails } = orderData;
  let delivery_date ;
  if(shippingLabelDetails != null){
    delivery_date=shippingLabelDetails.deiverydate
  }
  const totals = product_details.reduce(
    (acc, item) => {
      const price =
        item.product?.price || item.product_details?.priceAtPurchase || 0;
      const discount = item.product?.discount || 0;
      const quantity = item.quantity || 1;
      acc.totalWithoutDiscount += price * quantity;
      acc.totalDiscount += (price * discount) / 100 * quantity;
      return acc;
    },
    { totalWithoutDiscount: 0, totalDiscount: 0 }
  );
  const finalTotal = totals.totalWithoutDiscount - totals.totalDiscount;

  // Shipping cost
  const shippingCost = shippingLabelDetails
    ? 5 +
      shippingLabelDetails.weight * 1.5 +
      (shippingLabelDetails.dimensions?.length *
        shippingLabelDetails.dimensions?.width *
        shippingLabelDetails.dimensions?.height) /
        5000
    : 0;

  const grandTotal = (finalTotal + shippingCost).toFixed(2);

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between px-5 mb-6">
        <button
          onClick={() => navigate("/my-orders")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <FaArrowLeft /> Back to My Orders
        </button>
        {/* <p>Total Orders: {count}</p> */}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 bg-blue-200 shadow rounded-xl p-6">
          {/* Order Header */}
          <div className="flex justify-between items-center pb-4 mb-2">
            <h2 className="text-2xl font-bold">Order {order.order_Id}</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                {order.paymentStatus}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                {order.status}
              </span>
            </div>
          </div>
          <hr className="border-b border-blue-500 mb-6" />
            <div className="flex justify-between">
                <p><span className="font-semibold">Order Date: </span><span>{" "}{new Date(order.createdAt).toLocaleString()}</span></p>
            {delivery_date && (
              <p>
                <span className="font-semibold">Delivery Date:</span>{" "}
                {new Date(delivery_date).toLocaleDateString()}
              </p>
            )}
            </div>
          <OrderProgress currentStatus={order.status} />

          {/* Products */}
          <div className="flex justify-between px-4 mt-2 mb-2">
            <h3 className="text-lg font-semibold">Products</h3>
          </div>

          <div className="space-y-2">
            {Array.isArray(product_details) &&
              product_details.map((item, idx) => {
                {/* console.log("item",item.product.image[0]) */}
                const price =
                  item.product?.price ||
                  item?.priceAtPurchase ||
                  0;
                const discount = item.product?.discount || 0;
                const quantity = item.quantity || 1;
                const discountedPrice = price - (price * discount) / 100;
                const subtotal = discountedPrice * quantity;

                return (
                  <div
                    key={item?.productId || idx}
                    className="flex justify-between bg-blue-300 items-center border p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {item.product.image[0] && (
                        <img
                          src={item.product.image[0]}
                          alt={item?.name}
                          className="w-16 h-16 rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold">
                          {item?.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          Price: ₹{price} | Discount: {discount}%
                        </p>
                        <p className="text-sm text-gray-700">
                          Qty: {quantity}
                        </p>
                        <p className="text-sm text-gray-800">
                          Subtotal: ₹{subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
            <div className="flex justify-end">
            { (
              <button
                onClick={fetchShippingLabel}
                className="px-4 h-6 mt-3 bg-green-700 text-white rounded-md hover:bg-green-800"
              >
                View Shipping Label
              </button>
            )}
            </div>
          {/* Payment + Shipping */}
          <div className="bg-blue-300 p-6 rounded-lg mt-6 space-y-4 shadow-md">
              
            <p>
              <span className="font-semibold">Payment Mode:</span>{" "}
              {order.paymentMode}
            </p>
            <p>
              <span className="font-semibold">
                Total (Without Discount):
              </span>{" "}
              ₹{totals.totalWithoutDiscount.toFixed(2)}
            </p>
            <p className="text-red-600">
              <span className="font-semibold">Discount:</span> -
              ₹{totals.totalDiscount.toFixed(2)}
            </p>
            <p className="text-green-600 font-bold">
              <span className="font-semibold">Subtotal:</span>+₹
              {finalTotal.toFixed(2)}
            </p>
            <p className="text-green-600 font-bold">
              <span className="font-semibold">Shipping:</span>+₹
              {shippingCost.toFixed(2)}
            </p>

            <p className="text-lg font-bold">
              <span className="font-semibold">Grand Total:</span> ₹
              {grandTotal}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-blue-200 shadow-lg rounded-2xl p-6 border border-gray-200">
        {/* Header */}
        <h3 className="text-m font-bold text-gray-800 mb-2 pb-2">
            Customer, Shipping & Company Details
        </h3>
        <hr className="border-b border-blue-500 mb-6" />
        {/* Customer Section */}
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
            <CgProfile className="h-16 w-16 text-blue-500 border-2 border-blue-300 rounded-full p-2" />
            </div>
            
            <div>
            <p className="font-semibold text-gray-800 text-m">
                {user?.name || "Unknown"}
            </p>
            <p className="flex items-center text-sm text-gray-600 gap-2">
                <FaEnvelope className="text-gray-500" /> {user?.email || "-"}
            </p>
            <p className="flex items-center text-sm text-gray-600 gap-2">
                <FaPhoneAlt className="text-gray-500" /> {user?.mobile || "-"}
            </p>
            </div>
        </div>

        {/* Divider */}
        <hr className="border-b border-blue-500 mb-3" />

        {/* Shipping Section */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Address</h3>
            <p className="flex items-start text-sm text-gray-700 gap-2">
            <FaMapMarkerAlt className="mt-1 text-gray-500" />
            <span>
                {order.shippingAddress.fullAddress},<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pincode},<br />
                {order.shippingAddress.country}
            </span>
            </p>
            <p className="flex items-center text-sm text-gray-700 mt-2 gap-2">
            <FaPhoneAlt className="text-gray-500" /> {order.shippingAddress.phone}
            </p>

            {/* Map */}
            <hr className="border-b border-blue-400 mb-3 mt-3" />
            <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Map Preview</h4>
            <iframe
                title="Shipping Location"
                width="100%"
                height="200"
                frameBorder="0"
                className="rounded-lg border"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`
                )}&output=embed`}
                allowFullScreen
            />
            </div>
        </div>

        {/* Divider */}
        <hr className="border-b border-blue-500 mb-3 mt-3" />

        {/* Company Section */}
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 underline">Company Details</h3>
            <p className="flex items-center text-sm text-gray-700 gap-2">
            <FaBuilding className="text-gray-500" /> Akreddy Solutions Pvt Ltd
            </p>
            <p className="flex items-center text-sm text-gray-600 gap-2">
            <FaMapMarkerAlt className="text-gray-500" /> Hyderabad, Telangana, India
            </p>
            <p className="flex items-center text-sm text-gray-600 gap-2">
            <FaEnvelope className="text-gray-500" /> support@akreddysolutions.com
            </p>
            <p className="flex items-center text-sm text-gray-600 gap-2">
            <FaPhoneAlt className="text-gray-500" /> +91 98765 43210
            </p>
            <p className="flex items-center text-sm text-gray-600 gap-2 mt-2">
            <FaGlobe className="text-gray-500" />
            <a href="https://akreddysolutions.com" target="_blank" className="text-blue-600 underline">
                www.akreddysolutions.com
            </a>
            </p>
        </div>
        </div>

      </div>

      {/* Shipping Label Modal */}
      {shippingLabel && (
        <ShippingLabelModal
          isOpen={openLabel}
          onClose={() => setOpenLabel(false)}
          label={shippingLabel}
        />
      )}
    </div>
  );
};

export default UserOrderDetails;
