import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import NoData from '../components/NoData';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useEffect } from 'react';

const AllOrders = () => {
  const { fetchAllOrders } = useGlobalContext();
  const orders = useSelector(state => state.orders.ordersList);
console.log("orders cudaraaaaa",orders)
  const handleDeleteOrder = async (order_no) => {
    try {
      const res = await Axios({
        method: 'post',
        url: '/order/delete',
        data: { order_no }
      });
      toast.success(res.data.message || "Order deleted successfully");
      if (fetchAllOrders) fetchAllOrders();
    } catch (err) {
      AxiosToastError(err);
    }
  }

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>All Orders</h1>
      </div>

      {!orders?.length ? (
        <NoData />
      ) : (
        orders.map((order, idx) => (
          <div key={order._id + idx} className="order rounded p-4 text-sm border shadow mb-4 bg-white">

            <div className="flex justify-between items-center">
              <p><strong>Order No:</strong> {order.orderId || order._id}</p>
              <button
                onClick={() => handleDeleteOrder(order.order_no)}
                className="text-red-600 hover:underline text-xs"
              >
                Delete
              </button>
            </div>

            {/* Order items */}
            <div className="mt-3 space-y-3">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <img
                    src={item.product_details?.image?.[0] || item.image || ''}
                    alt={item.product_details?.name || item.name || 'Product'}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product_details?.name || item.name}</p>
                    <p className="text-gray-600 text-xs">
                      Qty: {item.quantity} | Price: ₹{item.priceAtPurchase}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                <p className="font-medium">Shipping Address:</p>
                <p>{order.shippingAddress.fullAddress}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country} - {order.shippingAddress.pincode}</p>
                <p>📞 {order.shippingAddress.phone}</p>
              </div>
            )}

            {/* Order summary */}
            <div className="mt-3 text-xs text-gray-600">
              <p>Payment Mode: {order.paymentMode}</p>
              <p>Payment Status: {order.paymentStatus}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Order Status: {order.status}</p>
              <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default AllOrders;