import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import NoData from '../components/NoData'
import AxiosToastError from '../utils/AxiosToastError'
import { useGlobalContext } from '../provider/GlobalProvider'

const MyOrders = () => {
  const { fetchOrder } = useGlobalContext()
  const orders = useSelector(state => state.orders.order)
  console.log("Orders:", orders)

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

  if (!orders?.length) return <NoData />

  return (
    <div className="p-0">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full border-collapse text-sm text-left">
          <thead className="bg-blue-400 text-gray-700 text-sm">
            <tr>
              <th className="p-3 border">Order No</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border">Delivery Address</th>
              <th className="p-2 border">Payment</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Placed On</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.orderId + index} className="hover:bg-gray-50">
                {/* Order No */}
                <td className="p-2 border font-medium">{order.orderId}</td>

                {/* Items */}
                <td className="p-3 border">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <img
                        src={item.product_details.image[0]}
                        alt={item.product_details.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>
                        {item.product_details.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </td>

                {/* Delivery Address */}
                <td className="p-3 border text-xs">
                  {order.delivery_address ? (
                    <>
                      <p>{order.delivery_address.address_line}</p>
                      <p>
                        {order.delivery_address.city}, {order.delivery_address.state}
                      </p>
                      <p>
                        {order.delivery_address.country} - {order.delivery_address.pincode}
                      </p>
                      <p>📞 {order.delivery_address.mobile}</p>
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>

                {/* Payment */}
                <td className="p-3 border">{order.payment_status}</td>

                {/* Total */}
                <td className="p-3 border font-semibold">₹{order.totalAmt}</td>

                {/* Placed On */}
                <td className="p-3 border">
                  {/* {new Date(order.createdAt).toLocaleString()} */}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>

                {/* Action */}
                <td className="p-3 border">
                  <button
                    onClick={() => handleDeleteOrder(order.order_no)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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