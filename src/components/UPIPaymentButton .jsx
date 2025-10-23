import { useState } from "react";
import Axios from "../utils/Axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UPIPaymentButton = ({ user, cartItems, totalPrice, shippingAddress }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    // console.log("ready",cartItems)
  const handleOnlinePayment = async () => {
    if (!shippingAddress?.addressId) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Create Razorpay order on backend
      const orderRes = await Axios.post("/payments/create-order", {
        user_id: user?.user_id,
        list_items: cartItems,
        totalAmt: totalPrice,
        addressId: shippingAddress.addressId,
      });

      const { orderId, amount, currency } = orderRes.data;

      // 2️⃣ Load Razorpay script
      await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.body.appendChild(script);
      });

      // 3️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount, // in paise
        currency: currency || 'INR',
        name: "Grozaar",
        description: `Payment of ₹${totalPrice}`,
        order_id: orderId, // MUST match backend order
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: { color: "#0ea5e9" },
        handler: async function (response) {
          // 4️⃣ Verify payment on backend
          // console.log("response n roz ",response)
          try {
            const verifyRes = await Axios.post("/payments/verify", {
              ...response,
              user_id: user?.user_id,
              list_items: cartItems,
              totalAmt: totalPrice,
              addressId: shippingAddress.addressId,
              paymentMode: "ONLINE",
            });

            if (verifyRes?.data?.success) {
              toast.success("Payment Successful ✅");
              navigate("/success", { state: { text: "Payment" } });
            } else {
              toast.error("Payment verification failed ❌");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed ❌");
          }
        },
        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },
        // ✅ UPI and other methods are automatically enabled; don't set `method: undefined`
        notes: {},
      };

      // 4️⃣ Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`w-full py-3 px-4 rounded border-2 font-semibold transition-colors ${
        loading
          ? "border-green-500 text-green-500 cursor-not-allowed opacity-70"
          : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
      }`}
      onClick={handleOnlinePayment}
      disabled={loading}
    >
      {loading ? "Processing..." : "Pay Online / UPI"}
    </button>
  );
};

export default UPIPaymentButton;
