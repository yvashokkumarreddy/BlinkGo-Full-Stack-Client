import { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UPIPaymentButton from "../components/UPIPaymentButton ";
// import UPIPaymentButton from "../components/UPIPaymentButton";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList || []);
  const [selectAddress, setSelectAddress] = useState(null);
  const cartItemsList = useSelector((state) => state.cartItem.cart || []);
  console.log("cartItems",cartItemsList)
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getSelectedAddressId = () => {
    if (selectAddress === null) return null;
    const addr = addressList[selectAddress];
    return addr ? addr.address_id : null;
  };

  const handleCashOnDelivery = async () => {
    if (selectAddress === null) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!cartItemsList || cartItemsList.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const address_id = getSelectedAddressId();
    if (!address_id) {
      toast.error("Invalid selected address");
      return;
    }

    const payload = {
      list_items: cartItemsList,
      user_id: user?.user_id,
      address_id,
      subTotalAmt: totalPrice,
      totalAmt: totalPrice,
      paymentMode: "COD",
    };

    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: payload,
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate("/success", { state: { text: "Order" } });
      } else {
        toast.error(response?.data?.message || "Failed to place order");
      }
    } catch (err) {
      console.error("COD error:", err);
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        {/* Address Section */}
        <div className="w-full">
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.length === 0 && (
              <div className="p-4 text-sm text-neutral-500">
                No addresses found. Please add an address.
              </div>
            )}
            {addressList.map((address, index) => (
              <label
                key={address.address_id || index}
                htmlFor={"address" + index}
                className={!address.status ? "hidden" : ""}
              >
                <div
                  className={`border rounded p-3 flex gap-3 hover:bg-blue-50 ${
                    selectAddress === index ? "border-green-600" : ""
                  }`}
                >
                  <div>
                    <input
                      id={"address" + index}
                      type="radio"
                      value={index}
                      checked={selectAddress === index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name="address"
                    />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>
                      {address.country} - {address.pincode}
                    </p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-md bg-white py-4 px-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quantity total</p>
              <p className="flex items-center gap-2">{totalQty} item</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4">
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="w-full flex flex-col gap-3 md:gap-4 mt-4">
            <UPIPaymentButton
              user={user}
              cartItems={cartItemsList}
              totalPrice={totalPrice}
              shippingAddress={{ addressId: getSelectedAddressId() }}
              onPaymentComplete={async () => {
                try {
                  const payload = {
                    user_id: user.user_id,
                    list_items: cartItemsList,
                    addressId: getSelectedAddressId(),
                    totalAmt: totalPrice,
                    paymentMode: "ONLINE",
                  };
                  const res = await Axios.post("/orders/create-online-order", payload);
                  if (res.data.success) {
                    toast.success("Order placed successfully!");
                    fetchCartItem?.();
                    fetchOrder?.();
                    navigate("/success", { state: { text: "Payment" } });
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to place order");
                }
              }}
            />

            <button
              className={`w-full py-3 px-4 rounded border-2 font-semibold transition-colors ${
                loading
                  ? "border-green-500 text-green-500 cursor-not-allowed opacity-70"
                  : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              }`}
              onClick={handleCashOnDelivery}
              disabled={loading}
            >
              {loading ? "Processing..." : "Cash on Delivery"}
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
