import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FiEye } from "react-icons/fi";
import NoData from "../components/NoData";

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();   // ✅ init navigate

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      try {
        const response = await Axios({ ...SummaryApi.getAllOrders });
        const ordersData = response.data.orders || [];
        setOrders(ordersData);

        if (!ordersData.length) return;

        const userResponses = await Promise.all(
          ordersData.map(async (ord) => {
            try {
              const res = await Axios({
                ...SummaryApi.userDetailsById,
                data: { user_id: ord.user_id },
              });
              const userName = res.data.data[0].name || "Unknown";
              return { userId: ord.user_id, name: userName };
            } catch (err) {
              console.error("Failed fetching user for:", ord.user_id, err);
              return { userId: ord.user_id, name: "Unknown" };
            }
          })
        );

        const usersMap = userResponses.reduce((acc, u) => {
          acc[u.userId] = u.name;
          return acc;
        }, {});
        setUsersMap(usersMap);

      } catch (err) {
        console.error("Error fetching orders/users:", err);
        setError("Failed to fetch orders or users");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndUsers();
  }, []);

  if (loading) return <p className="p-4"><NoData /></p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!orders.length) return <p className="p-4"><NoData /></p>;

  return (
    <div className="p-0">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-blue-400 text-gray-700 text-sm">
            <tr>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Items</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_Id} className="hover:bg-gray-50">
                <td className="p-3 border font-medium">{order.order_Id}</td>

                <td className="p-3 border">
                  {usersMap[order.user_id] || "Unknown User"} <br />
                  <span className="text-xs text-gray-500">
                    {order.shippingAddress?.phone}
                  </span>
                </td>

                <td className="p-3 border">
                  {order.orderItems?.map((item) => (
                    <div key={item.productId} className="flex items-center gap-2 mb-1">
                      <img
                        src={item.product_details?.image?.[0]}
                        alt={item.product_details?.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm">
                        {item.product_details?.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </td>

                <td className="p-3 border font-semibold">
                  ₹{order.totalAmount?.toLocaleString()}
                </td>

                <td className="p-2 border">
                  <div>
                    {order.paymentMode}{" "}
                    <span
                      className={`px-2 py-1 ml-1 rounded text-xs font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>

                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-3 border">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* 👁️ View Action */}
                <td className="p-3 border">
                  <button
                    className="text-xl text-blue-600 hover:text-blue-800"
                    onClick={() =>
                      navigate("/order-details", { state: { order_Id: order.order_Id,user_id:order.user_id } })

                    }
                  >
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
