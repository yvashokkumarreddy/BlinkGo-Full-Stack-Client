import { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa6";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const cartItem = useSelector(state => state.cartItem.cart);
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState(null);

  // ✅ Add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🔥 stop page navigation
    if (!user?.user_id || !user?.cartId) {
      return toast.error("User cart not found");
    }

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          user_id: Number(user.user_id),
          productId: Number(data.productId),
          cartId: Number(user.cartId),
        },
      });

      const { success, message } = response.data;
      if (success) {
        toast.success(message || "Added to cart");
        await fetchCartItem(); // sync global cart
      } else {
        toast.error(message || "Failed to add");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync local state with redux cart
  useEffect(() => {
    if (!data?.productId) {
      setIsInCart(false);
      setQty(0);
      setCartItemDetails(null);
      return;
    }

    const item = cartItem?.find(ci => Number(ci.product?.productId) === Number(data.productId));
// console.log("cartItemDetails:---",cartItem)
    if (item) {
      setIsInCart(true);
      setQty(item.quantity);
      setCartItemDetails(item);
    } else {
      setIsInCart(false);
      setQty(0);
      setCartItemDetails(null);
    }
  }, [cartItem, data]);
// console.log("cartItemDetails:---",cartItemDetails)
  const increaseQty = async () => {
  if (!cartItemDetails) return;
  const response = await updateCartItem(cartItemDetails.cartItemId, quantity + 1);
  if (response?.success) {
    setQty(quantity + 1);
    fetchCartItem(); // refresh Redux state
  }
};

const decreaseQty = async () => {
  if (!cartItemDetails) return;
  if (quantity === 1) {
    const response = await deleteCartItem(cartItemDetails.cartItemId);
    if (response?.success) {
      setIsInCart(false);
      fetchCartItem();
    }
  } else {
    const response = await updateCartItem(cartItemDetails.cartItemId, quantity - 1);
    if (response?.success) {
      setQty(quantity - 1);
      fetchCartItem();
    }
  }
};


  return (
    <div
      className="w-full max-w-[150px]"
      onClick={(e) => e.stopPropagation()} // 🔥 prevent bubbling to product card
    >
      {isInCart ? (
        <div className="flex w-full h-full">
          <button
            type="button"
            disabled={loading}
            onClick={decreaseQty}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white flex-1 p-1 rounded flex items-center justify-center"
          >
            <FaMinus />
          </button>
          <p className="flex-1 font-semibold px-1 flex items-center justify-center">{quantity}</p>
          <button
            type="button"
            disabled={loading}
            onClick={increaseQty}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white flex-1 p-1 rounded flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-2 lg:px-4 py-1 rounded"
        >
          {loading ? <Loading /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
