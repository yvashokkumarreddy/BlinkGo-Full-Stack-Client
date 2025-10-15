import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { FiEye } from "react-icons/fi";

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const navigate = useNavigate()

  if (!orders?.length) return <NoData />

  return (
    <div className="p-4 w-full bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-[950px] border-collapse text-sm text-left">
          <thead className="bg-blue-400 text-gray-700 text-sm">
            <tr>
              <th className="p-3 border">Order No</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border">Delivery Address</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Placed On</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.orderId + index} className="hover:bg-blue-200 bg-blue-100">
                <td className="p-3 border font-medium">{order.orderId}</td>
                <td className="p-3 border">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <img
                        src={item.product_details.image[0]}
                        alt={item.product_details.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{item.product_details.name} × {item.quantity}</span>
                    </div>
                  ))}
                </td>
                <td className="p-3 border text-xs">
                  {order.delivery_address ? (
                    <>
                      <p>{order.delivery_address.address_line}</p>
                      <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                      <p>{order.delivery_address.country} - {order.delivery_address.pincode}</p>
                    </>
                  ) : "N/A"}
                </td>
                <td className="p-3 border font-semibold">₹{order.totalAmt}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Confirmed"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Pending"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 border">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() =>
                      navigate("/user-order-details", {
                        state: { order_Id: order.orderId, user_id: order.user_id, len: orders.length }
                      })
                    }
                    className="text-xl text-blue-600 hover:text-blue-800"
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {orders.map((order, index) => (
          <div key={order.orderId + index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Order #{order.orderId}</h2>
              <button
                onClick={() =>
                  navigate("/user-order-details", {
                    state: { order_Id: order.orderId, user_id: order.user_id, len: orders.length }
                  })
                }
                className="text-xl text-blue-600 hover:text-blue-800"
              >
                <FiEye />
              </button>
            </div>

            {/* Items */}
            <div className="mb-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <img
                    src={item.product_details.image[0]}
                    alt={item.product_details.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm">{item.product_details.name} × {item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Delivery */}
            <div className="text-xs text-gray-600 mb-2">
              {order.delivery_address ? (
                <>
                  <p>{order.delivery_address.address_line}</p>
                  <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                  <p>{order.delivery_address.country} - {order.delivery_address.pincode}</p>
                </>
              ) : "N/A"}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">₹{order.totalAmt}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Confirmed"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Pending"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
