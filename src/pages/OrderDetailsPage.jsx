import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderProgress from "../components/OrderProgress";
// import ReserveItemModal from "../components/ReserveItemModal";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { FaArrowLeft } from "react-icons/fa";
import profile from '../assets/profile.png'

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.order_Id;
  const userId = location.state?.user_id;
  const [orderData, setOrderData] = useState(null);
  // const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return console.error("❌ No orderId found in location.state");
      try {
        const res = await Axios({
          ...SummaryApi.getOrderById,
          data: { orderId, userId },
        });
        setOrderData(res.data);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  // const handleReserve = async (reservedItems) => {
  //   try {
  //     const res = await Axios({
  //       ...SummaryApi.reserveItems,
  //       data: {
  //         orderId: orderData.order.order_Id,
  //         items: reservedItems,
  //       },
  //     });
  //     setOrderData(res.data);
  //     // setOpenModal(false);
  //     alert("Items reserved successfully!");
  //   } catch (err) {
  //     console.error("❌ Error reserving items:", err);
  //     alert("Failed to reserve items");
  //   }
  // };

  if (!orderId) return <p className="p-6 text-red-600">⚠ No order selected.</p>;
  if (!orderData) return <p className="p-6">Loading order details...</p>;

  const { order, user, product_details } = orderData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ← Back Button */}
      <button
        onClick={() => navigate("/dashboard/orders")}
        className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 font-medium"
      >
        <FaArrowLeft /> Back to Orders
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
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

          <p className="text-gray-500 mb-6">
            Order date: {new Date(order.createdAt).toLocaleString()}
          </p>
          <OrderProgress currentStatus={order.status} />

          <div className="flex justify-between my-4">
            <button className="underline text-red-500">Cancel Order</button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Ship
            </button>
          </div>

          {/* ✅ Product Details */}
          <h3 className="text-lg font-semibold mb-3">Products</h3>
          <div className="space-y-4">
            {Array.isArray(product_details) &&
              product_details.map((item, idx) => {
                const price = item.product?.price || 0;
                const discount = item.product?.discount || 0;
                const quantity = item.quantity || 1;

                const discountedPrice = price - (price * discount) / 100;
                const subtotal = discountedPrice * quantity;

                return (
                  <div
                    key={item.product?._id || idx}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {item.product?.image?.[0] && (
                        <img
                          src={item.product.image[0]}
                          alt={item.product?.name}
                          className="w-16 h-16 rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">
                          Price: ₹{price} | Discount: {discount}%
                        </p>
                        <p className="text-sm text-gray-500">Qty: {quantity}</p>
                        <p className="text-sm text-gray-600">
                          Subtotal: ₹{subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ✅ Payment Details */}
          <h3 className="text-lg font-semibold mt-6 mb-3">Payment Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <span className="font-semibold">Payment Mode:</span>{" "}
              {order.paymentMode}
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
                    ((item.product?.price || 0) *
                      (item.product?.discount || 0) /
                      100) *
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
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white shadow rounded-xl p-6 space-y-6">
          <div>
          <h3 className="text-lg font-semibold mb-3">Customer</h3>
              <img src={profile} className='rounded-m'
                alt='banner' />
            <p className="font-semibold">Name: {user?.name || "Unknown"}</p>
            <p className="text-sm text-gray-600">Email: {user?.email || "-"}</p>
            <p className="text-sm text-gray-600">Mobile: {user?.mobile || "-"}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.fullAddress},<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode},<br />
              {order.shippingAddress.country}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              📞 {order.shippingAddress.phone}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              📍 View on Map
            </a>
          </div>
        </div>
      </div>

      {/* <ReserveItemModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        products={order.orderItems}
        onReserve={handleReserve}
      /> */}
    </div>
  );
};

export default OrderDetails;
