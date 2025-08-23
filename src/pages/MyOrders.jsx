// import { useReducer } from 'react'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import NoData from '../components/NoData'
import AxiosToastError from '../utils/AxiosToastError'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  //const [, forceUpdate] = useReducer(x => x + 1, 0)

  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await Axios({
        method: 'delete',
        url: `/order/delete/${orderId}` // Make sure this matches the route
      })
      toast.success(res.data.message || "Order deleted successfully")
      window.location.reload() // or refetch orders
    } catch (err) {
      AxiosToastError(err)
    }
  }
  

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>My Orders</h1>
      </div>
      {
        !orders[0] ? (
          <NoData />
        ) : (
          orders.map((order, index) => (
            <div key={order._id + index + "order"} className='order rounded p-4 text-sm border shadow mb-4 bg-white'>
              <div className='flex justify-between items-center'>
                <p><strong>Order No:</strong> {order?.orderId}</p>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className='text-red-600 hover:underline text-xs'
                >
                  Delete
                </button>
              </div>
              <div className='flex gap-3 mt-2'>
                <img
                  src={order.product_details.image[0]}
                  className='w-14 h-14 object-cover rounded'
                  alt="Product"
                />
                <div>
                  <p className='font-medium'>{order.product_details.name}</p>
                  <p className='text-gray-600 text-xs'>Qty: {order.quantity}</p>
                </div>
              </div>
            </div>
          ))
        )
      }
    </div>
  )
}

export default MyOrders
