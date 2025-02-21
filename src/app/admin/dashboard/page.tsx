"use client";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/app/components/protectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface ImageType {
  asset: {
    _ref: string;
    _type: string;
  };
}

interface Order {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  city: string;
  phone: number;
  zipCode: number;
  totalPrice: number;
  orderDate: string;
  orderStatus: string | null;
  cartItems: {
    product:string ;
    size: React.JSX.Element;
    color: React.JSX.Element;
    quantity: number; name: string; image: ImageType | null
  }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
  _id,
  firstname,
  lastname,
  email,
  address,
  city,
  phone,
  zipCode,
  totalPrice,
  orderDate,
  orderStatus,
  cartItems[] {
    product-> {
      name,
      image
    },
    size,
    color,
    quantity
  }
}
`
      )
      .then((data) => setOrders(data))
      .catch(() => console.error("Error fetching orders"));
  }, []);


  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.firstname} ${order.lastname}`.toLowerCase();
    return (
      (filter === "All" || order.orderStatus === filter) &&
      fullName.includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "The order has been deleted.", "success");
    } catch {
      Swal.fire("Error!", "Failed to delete the order.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ orderStatus: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      Swal.fire("Updated!", `Order status updated to ${newStatus}.`, "success");
    } catch {
      Swal.fire("Error!", "Failed to update the order status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 sm:p-8">
        <nav className="bg-blue-600 text-white p-6 rounded-xl shadow-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h2 className="text-xl md:text-3xl font-extrabold">Admin Dashboard</h2>
            <div className="flex flex-wrap  gap-4">
              {"All pending success dispatch".split(" ").map((status) => (
                <button
                  key={status}
                  className={`p-1 rounded-sm sm:px-4 sm:py-2 sm:rounded-lg sm:transition-all ${filter === status ? "bg-white text-blue-600 font-bold" : "text-white"
                    } hover:bg-blue-700 hover:text-white`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}

                </button>

              ))}
              <Link href={'/'} className='absolute top-2 right-2 sm:relative  '> <LogOut /></Link>
            </div>
          </div>
        </nav>

        <div className="flex justify-center mb-6">
          <Input
            placeholder="Search by customer name..."
            className="w-full max-w-md px-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-auto">
          <table className="w-full bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Order ID</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr
                  key={order._id} // Ensure this key is unique
                  className="border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4">{order._id}</td>
                  <td className="px-6 py-4">
                    {order.firstname} {order.lastname}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">${order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <Select
                      value={order.orderStatus || ""}
                      onValueChange={(newStatus) =>
                        handleStatusChange(order._id, newStatus)
                      }
                    >
                      <SelectTrigger className="border rounded-lg px-3 py-2 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="dispatch">Dispatched</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(order._id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center items-center space-x-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-4">Page {currentPage}</span>
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                prev * ordersPerPage < filteredOrders.length ? prev + 1 : prev
              )
            }
            disabled={currentPage * ordersPerPage >= filteredOrders.length}
          >
            Next
          </Button>
        </div>

        {/* Modal for Order Details */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full">
              <h3 className="text-2xl font-bold mb-4">
                Order Details for {selectedOrder.firstname} {selectedOrder.lastname}
              </h3>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}
              </p>
              <p>
                <strong>Total Price:</strong> ${selectedOrder.totalPrice}
              </p>

              {/* Dynamic Cart Items Section */}
              <div className="my-4">
                <h4 className="font-semibold">Cart Items:</h4>
                {selectedOrder.cartItems.map((item, index) => (
                  <div key={`${item.product?.name}-${index}`} className="flex items-center mt-2">
                    {item.product?.image ? (
                      <Image
                        src={urlFor(item.product.image).url()}
                        alt={item.product?.name || "Product Image"}
                        width={50}
                        height={50}
                        className="rounded-md mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                    )}

                    <div>
                      <p>{item.product?.name}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}



              </div>

              <Button className="mt-4" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
