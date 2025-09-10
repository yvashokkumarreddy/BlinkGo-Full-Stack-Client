import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

// ✅ Context + Hook (named exports only)
export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ( {children} ) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  const fetchCartItem = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCartItem,
        data: { user_id: user.user_id },
       });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { cartItemId: cartItemId, quantity },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        fetchCartItem();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { cartItemId: cartItemId },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => preve + curr.quantity, 0);
    setTotalQty(qty);

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = pricewithDiscount(
        curr?.product?.price,
        curr?.product?.discount
      );
      return preve + priceAfterDiscount * curr.quantity;
    }, 0);
    console.log("totalPrice",tPrice)
    setTotalPrice(tPrice);

    const notDiscountPrice = cartItem.reduce(
      (preve, curr) => preve + curr?.product?.price * curr.quantity,
      0
    );
    setNotDiscountTotalPrice(notDiscountPrice);
  }, [cartItem]);

  const handleLogoutOut = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      // silently ignore
      console.log(error)
    }
  };
  const fetchAllOrders = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAllOrders });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      // silently ignore
      console.log(error)
    }
  };
  const fetchOrder = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getOrderItems,data: { user_id: user.user_id } });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
 
 

  useEffect(() => {
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        fetchAllOrders,
        fetchOrder,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
