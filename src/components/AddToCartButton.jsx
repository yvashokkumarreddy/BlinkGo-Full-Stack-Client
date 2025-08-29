import { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
    const cartItem = useSelector(state => state.cartItem.cart);
    const user = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [qty, setQty] = useState(0);
    const [cartItemDetails, setCartItemDetails] = useState();

    // Add to cart
    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!user?.user_id) return toast.error("User not found");
        console.log("dataaaaaa",data)
        try {
            setLoading(true);
            const response = await Axios.post("/cart/create", {
                user_id: user.user_id,
                productId: Number(data.productId), // ✅ Ensure Number
                });

            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem();
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };
console.log("cart_item",cartItem)
    // Check if product is in cart
    useEffect(() => {
        const item = cartItem?.find(ci => ci.productId === data.productId);
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

    // Increase quantity
    const increaseQty = async () => {
        if (!cartItemDetails) return;
        const response = await updateCartItem(cartItemDetails.cartItemId, qty + 1);
        if (response?.success) setQty(qty + 1);
    };

    // Decrease quantity
    const decreaseQty = async () => {
        if (!cartItemDetails) return;
        if (qty === 1) {
            const response = await deleteCartItem(cartItemDetails.cartItemId);
            if (response?.success) setIsInCart(false);
        } else {
            const response = await updateCartItem(cartItemDetails.cartItemId, qty - 1);
            if (response?.success) setQty(qty - 1);
        }
    };

    return (
        <div className='w-full max-w-[150px]'>
            {isInCart ? (
                <div className='flex w-full h-full'>
                    <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 p-1 rounded flex items-center justify-center'><FaMinus /></button>
                    <p className='flex-1 font-semibold px-1 flex items-center justify-center'>{qty}</p>
                    <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 p-1 rounded flex items-center justify-center'><FaPlus /></button>
                </div>
            ) : (
                <button onClick={handleAddToCart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                    {loading ? <Loading /> : "Add"}
                </button>
            )}
        </div>
    );
};

export default AddToCartButton;
