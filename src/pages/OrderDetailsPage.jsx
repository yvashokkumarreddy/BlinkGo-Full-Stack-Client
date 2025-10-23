import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import OrderProgress from "../components/OrderProgress";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import ConfirmPopup from "../popUps/OrderConfirmPopup";
import ShippingFormModal from "../popUps/shippinglable";
import profile from "../assets/profile.png";
import ShippingLabelModal from "../popUps/ShippingLabelModal";
import { CgProfile } from "react-icons/cg";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.order_Id;
  const userId = location.state?.user_id;
  const count = location.state?.len || 0;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);

  const [shippingLabel, setShippingLabel] = useState(null);
  const [openLabel, setOpenLabel] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await Axios({
          ...SummaryApi.getOrderById,
          data: { orderId, userId },
        });
        // console.log("shipping label", res.data)
        setOrderData(res.data);
        // If label exists in order, use it
        if (res.data?.shippingLabelDetails) {
          setShippingLabel(res.data);
          setOpenLabel(true);
        }
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
      // console.log("response",res.data)
      if (res.data?.data) {
        setShippingLabel(res.data);
        setOpenLabel(true); // Open modal automatically
      } else {
        alert("No shipping label found for this order");
      }
    } catch (err) {
      console.error("Error fetching shipping label:", err);
      alert("Error fetching shipping label details");
    }
  };

  // Update order status
  const updateOrderStatus = async (newStatus, deliveryDate = null) => {
    if (!orderData) return;
    try {
      await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId: orderData.order.order_Id,
          status: newStatus,
          deliveryDate,
        },
      });
      setOrderData((prev) => ({
        ...prev,
        order: { ...prev.order, status: newStatus, deliveryDate },
      }));
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // if (loading) return <p className="p-6">Loading order details...</p>;
 if (loading) return (
  <div className="fixed inset-0 flex justify-center items-center bg-white/50 backdrop-blur-sm z-50">
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
    </div>
  </div>
);




  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!orderData) return <p className="p-6 text-red-600">No order selected.</p>;

  const { order, user, product_details } = orderData;
// console.log("orderData",orderData.shippingLabelDetails)
  // Totals
  const totals = product_details.reduce(
    (acc, item) => {
      const price = item.product?.price || item.product_details?.priceAtPurchase || 0;
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
  // console.log("shipping labe7777l",shippingLabel)
  let shippingCost;
  if(shippingLabel !== null){
    shippingCost =  5 + shippingLabel.weight * 1.5 +
      (shippingLabel.shippingLabelDetails.dimensions?.length *
        shippingLabel.shippingLabelDetails.dimensions?.width *
        shippingLabel.shippingLabelDetails.dimensions?.height) / 5000
  }else{
    shippingCost = 0
  }
  // {shippingLabel === null ? 0 : (
  //    shippingCost =  5 + shippingLabel.shippingLabelDetails.weight * 1.5 +
  //     (shippingLabel.shippingLabelDetails.dimensions?.length *
  //       shippingLabel.shippingLabelDetails.dimensions?.width *
  //       shippingLabel.shippingLabelDetails.dimensions?.height) / 5000
  // )
  //     }
// console.log("shippingLabel akkkk",shippingLabel.shippingLabelDetails)
  const grandTotal =shippingCost === 0 ? (finalTotal + shippingCost).toFixed(2): null;
        // console.log("after grand")
  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between px-5 mb-6">
        <button
          onClick={() => navigate("/dashboard/orders")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <FaArrowLeft /> Back to Orders
        </button>
        {/* <p>Total Orders: {count}</p> */}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 bg-blue-200 shadow rounded-xl p-6">
          {/* Order Header */}
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
          <div className="flex justify-between">
          <p>
            <span className ="font-semibold" >Order Date: </span>{new Date(order.createdAt).toLocaleString()}
          </p>
          {orderData.shippingLabelDetails && (
              <p>
                <span className="font-semibold">Delivery Date:</span> {new Date(orderData.shippingLabelDetails.deiverydate).toLocaleDateString()}
              </p>
            )}
            </div>
          <OrderProgress currentStatus={order.status} />

          {/* Action Buttons */}
          <div className="flex justify-between my-4">
            <div>
            {order.status === "Pending" && (
              <button onClick={() => updateOrderStatus("Cancelled")} className="underline text-red-500">
                Cancel Order
              </button>
            )}
            </div>
            <div className="text-right gap-2">
              {order.status === "Pending" && (
                <button
                  onClick={() => setShowConfirmPopup(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Confirm Order
                </button>
              )}
              {order.status === "Confirmed" && (
                <button
                  onClick={() => setOpenShipping(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Ship
                </button>
              )}
              {order.status === "Shipped" && (
                <button
                  onClick={() => updateOrderStatus("Out for Delivery")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Out for Delivery
                </button>
              )}
              {order.status === "Out for Delivery" && (
                <button
                  onClick={() => updateOrderStatus("Delivered")}
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="flex justify-between bg-blue-200 px-4 mb-2">
            <h3 className="text-lg font-semibold">Products</h3>
            {/* {order.status === "Shipped" && (
              <button
                onClick={fetchShippingLabel}
                className="px-4 h-6 bg-green-700 text-white rounded-md hover:bg-green-800"
              >
                Shipping Label
              </button>
            )} */}
          </div>

          <div className="space-y-2 bg-blue-300 rounded-xl">
            {Array.isArray(product_details) &&
              product_details.map((item, idx) => {
                {/* console.log("item", item) */}
                const price = item.product?.price || item.product_details?.priceAtPurchase || 0;
                const discount = item.product?.discount || 0;
                const quantity = item.quantity || 1;
                const discountedPrice = price - (price * discount) / 100;
                const subtotal = discountedPrice * quantity;

                return (
                  <div key={item.product?._id || idx} className="flex justify-between items-center border p-3 rounded-xl">
                    <div className="flex items-center gap-4">
                      {item.product?.image?.[0] && (
                        <img src={item.product.image[0]} alt={item.product_details?.name} className="w-16 h-16 rounded-lg" />
                      )}
                      <div>
                        <p className="font-semibold">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">
                          Price: ₹{price} | Discount: {discount}%
                        </p>
                        <p className="text-sm text-gray-500">Qty: {quantity}</p>
                        <p className="text-sm text-gray-600">Subtotal: ₹{subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Payment + Shipping */}
          <div className="bg-blue-300 p-6 rounded-lg mt-6 space-y-4 shadow-md">
            <p>
              <span className="font-semibold">Payment Mode:</span> {order.paymentMode}
            </p>
            <p>
              <span className="font-semibold">Total (Without Discount):</span> ₹{totals.totalWithoutDiscount.toFixed(2)}
            </p>
            <p className="text-red-600">
              <span className="font-semibold">Discount:</span> -₹{totals.totalDiscount.toFixed(2)}
            </p>
            <p className="text-green-600 font-bold">
              <span className="font-semibold">Subtotal:</span>+₹{finalTotal.toFixed(2)}
            </p>
            {/* { shippingCost !== 0 && <p className="text-green-600 font-bold">
              <span className="font-semibold">Shipping Charges:</span>+₹{shippingCost.toFixed(2)}
            </p>
            } */}
            

            <p className="text-lg font-bold">
              <span className="font-semibold">Grand Total:</span> ₹{finalTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-blue-200 shadow rounded-xl p-6 space-y-6">
          <div className="flex col items-center gap-4 mb-6">
            <CgProfile className="h-16 w-16 text-blue-500 border-2 border-blue-300 rounded-full p-2" />
            <div>
              <p className="font-semibold text-gray-800">{user?.name || "Unknown"}</p>
              <p className="flex items-center text-sm text-gray-600 gap-2"><FaEnvelope className="text-gray-500" /> {user?.email || "-"}</p>
              <p className="flex items-center text-sm text-gray-600 gap-2"><FaPhoneAlt className="text-gray-500" /> {user?.mobile || "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.fullAddress},<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode},<br />
              {order.shippingAddress.country}
            </p>
            <p className="text-sm text-gray-600 mt-2">📞 {order.shippingAddress.phone}</p>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Map Preview</h4>
              <iframe
                title="Shipping Location"
                width="100%"
                height="200"
                frameBorder="0"
                style={{ border: 0, borderRadius: "8px" }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`
                )}&output=embed`}
                allowFullScreen
              />
            </div>
          </div>
        </div>
        
      </div>

      {/* Confirm Popup */}
      {showConfirmPopup && (
        <ConfirmPopup
          order={order}
          user={user}
          productDetails={product_details}
          onClose={() => setShowConfirmPopup(false)}
          onConfirm={(deliveryDate) => {
            updateOrderStatus("Confirmed", deliveryDate);
            setShowConfirmPopup(false);
          }}
        />
      )}

      {/* Shipping Modal */}
      <ShippingFormModal
        isOpen={openShipping}
        onClose={() => setOpenShipping(false)}
        orderId={order.order_Id}
        product_details={product_details}
        deliveryDate={order.deliveryDate}
        onShippingComplete={(label) => setShippingLabel(label)}
        onConfirm={(deliveryDate) => {
          updateOrderStatus("Shipped", deliveryDate);
          setOpenShipping(false);
        }}
      />

      {/* Shipping Label Modal */}
      
      {shippingLabel && (
        <ShippingLabelModal
          isOpen={openLabel}
          onClose={() => setOpenLabel(false)}
          label={shippingLabel}
          // OrderDetails={shippingLabel}
          product_details={product_details}
        />
      )}
    </div>
  );
  
};

export default OrderDetails;
