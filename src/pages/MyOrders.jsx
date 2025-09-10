import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import NoData from '../components/NoData'
import AxiosToastError from '../utils/AxiosToastError'
import { useGlobalContext } from '../provider/GlobalProvider'

const MyOrders = () => {
  const { fetchOrder } = useGlobalContext()
  const orders = useSelector(state => state.orders.order)
console.log("chudaraa===>",orders)
  const handleDeleteOrder = async (order_no) => {
    try {
      const res = await Axios({
        method: 'post',
        url: '/order/delete',
        data: { order_no }
      })
      toast.success(res.data.message || "Order deleted successfully")
      if (fetchOrder) fetchOrder()
    } catch (err) {
      AxiosToastError(err)
    }
  }

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>My Orders</h1>
      </div>

      {!orders?.length ? (
        <NoData />
      ) : (
        orders.map((order, index) => (
          <div
            key={order.orderId + index}
            className="order rounded p-4 text-sm border shadow mb-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <p>
                <strong>Order No:</strong> {order?.orderId}
              </p>
              <button
                onClick={() => handleDeleteOrder(order.order_no)}
                className="text-red-600 hover:underline text-xs"
              >
                Delete
              </button>
            </div>

            {/* Order items */}
            <div className="mt-3 space-y-3">
              {order.items.map((item, idx) => (
                <div key={order.orderId + idx} className="flex gap-3">
                  <img
                    src={item.product_details.image[0]}
                    className="w-14 h-14 object-cover rounded"
                    alt={item.product_details.name}
                  />
                  <div>
                    <p className="font-medium">{item.product_details.name}</p>
                    <p className="text-gray-600 text-xs">
                      Qty: {item.quantity} | Subtotal: ₹{item.subTotalAmt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            {order.delivery_address && (
              <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                <p className="font-medium">Delivery Address:</p>
                <p>{order.delivery_address.address_line}</p>
                <p>
                  {order.delivery_address.city}, {order.delivery_address.state}
                </p>
                <p>
                  {order.delivery_address.country} - {order.delivery_address.pincode}
                </p>
                <p>📞 {order.delivery_address.mobile}</p>
              </div>
            )}

            {/* Order summary */}
            <div className="mt-3 text-xs text-gray-600">
              <p>Payment: {order.payment_status}</p>
              <p>Total: ₹{order.totalAmt}</p>
              <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrders


// import { useSelector } from 'react-redux'
// import Axios from '../utils/Axios'
// import toast from 'react-hot-toast'
// import NoData from '../components/NoData'
// import AxiosToastError from '../utils/AxiosToastError'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

// const MyOrders = () => {
//   const { fetchOrder } = useGlobalContext()
//   const orders = useSelector(state => state.orders.order)

//   const handleDeleteOrder = async (order_no) => {
//     try {
//       const res = await Axios({
//         method: 'post',
//         url: '/order/delete', // Ensure this route matches your backend
//         data: { order_no }
//       })
//       toast.success(res.data.message || "Order deleted successfully")
//       if (fetchOrder) fetchOrder()
//     } catch (err) {
//       AxiosToastError(err)
//     }
//   }

//   if (!orders || !orders.length) return <NoData />

//   return (
//     <div>
//       <div className='bg-white shadow-md p-3 font-semibold'>
//         <h1>My Orders</h1>
//       </div>
//       {orders.map((order) => (
//         <div key={order.orderId} className='order rounded p-4 text-sm border shadow mb-4 bg-white'>
//           <div className='flex justify-between items-center'>
//             <p><strong>Order No:</strong> {order.orderId}</p>
//             <button
//               onClick={() => handleDeleteOrder(order.order_no)}
//               className='text-red-600 hover:underline text-xs'
//             >
//               Delete
//             </button>
//           </div>

//           {/* Loop through items in this order */}
//           {order.items.map((item, idx) => (
//             <div key={item.productId + idx} className='flex gap-3 mt-2 border-t pt-2'>
//               <img
//                 src={item.product_details.image[0]}
//                 className='w-14 h-14 object-cover rounded'
//                 alt={item.product_details.name}
//               />
//               <div className='flex-1'>
//                 <p className='font-medium'>{item.product_details.name}</p>
//                 <p className='text-gray-600 text-xs'>Qty: {item.quantity}</p>
//                 {item.subTotalAmt && (
//                   <p className='text-gray-600 text-xs'>Subtotal: {DisplayPriceInRupees(item.subTotalAmt)}</p>
//                 )}
//               </div>
//             </div>
//           ))}

//           <div className='mt-2 font-semibold flex justify-between'>
//             <p>Total Amount:</p>
//             <p>{DisplayPriceInRupees(order.totalAmt)}</p>
//           </div>

//           {order.delivery_address && (
//             <div className='mt-2 text-xs text-gray-700'>
//               <p><strong>Delivery Address:</strong></p>
//               <p>{order.delivery_address.address_line}, {order.delivery_address.city}</p>
//               <p>{order.delivery_address.state}, {order.delivery_address.country} - {order.delivery_address.pincode}</p>
//               <p>Phone: {order.delivery_address.mobile}</p>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default MyOrders