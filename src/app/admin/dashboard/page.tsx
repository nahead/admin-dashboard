'use client';
import ProtectedRoute from '@/app/components/protectedRoute';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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
  cartItems: { name: string; image: any }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

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
          cartItems[]->{name, image}
        }`
      )
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  const filteredOrders =
    filter === 'All' ? orders : orders.filter((order) => order.orderStatus === filter);

  const toggleOrderDetail = (orderId: string) => {
    setSelectedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire('Deleted!', 'The order has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong while deleting the order.', 'error');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ orderStatus: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, orderStatus: newStatus } : order))
      );
      Swal.fire('Updated!', `Order status updated to ${newStatus}.`, 'success');
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong while updating the status.', 'error');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-6">
        <nav className="bg-blue-600 text-white p-4 shadow-lg rounded-xl flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {['All', 'pending', 'success', 'dispatch'].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? 'bg-white text-blue-600 font-bold' : 'text-white'
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>
        <div>
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <div className="overflow-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Order ID</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Customer</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Address</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Total Amount</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="border-b cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleOrderDetail(order._id)}
                    >
                      <td className="px-4 py-2">{order._id}</td>
                      <td className="px-4 py-2">
                        {order.firstname} {order.lastname}
                      </td>
                      <td className="px-4 py-2">
                        {order.address}, {order.city}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">${order.totalPrice}</td>
                      <td className="px-4 py-2">
                        <select
                          className="border rounded-lg px-2 py-1"
                          value={order.orderStatus || ''}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="dispatch">Dispatched</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedOrder === order._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="p-4">
                          <h3 className="font-semibold mb-2">Cart Items:</h3>
                          <p>Email: {order.email}</p>
                          <p>Phone: {order.phone}</p>
                          <p>
                            Address: {order.address}, {order.city}
                          </p>
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li key={`${order._id}-${index}`} className="flex items-center space-x-4 mb-2">
                                {item.image ? (
                                  <Image
                                    src={urlFor(item.image).url()}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                    className="rounded-lg"
                                  />
                                ) : (
                                  <div>No Image</div>
                                )}
                                <span>{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
