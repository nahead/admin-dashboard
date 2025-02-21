import { defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    { name: "firstname", title: "First Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "lastname", title: "Last Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "email", title: "Email", type: "string", validation: (Rule) => Rule.email().required() },
    { name: "address", title: "Address", type: "string", validation: (Rule) => Rule.required() },
    { name: "city", title: "City", type: "string", validation: (Rule) => Rule.required() },
    { name: "zipCode", title: "Zip Code", type: "string", validation: (Rule) => Rule.required().min(4).max(10) },
    { name: "phone", title: "Phone", type: "string", validation: (Rule) => Rule.required().min(10).max(15) },

    {
      name: "cartItems",
      title: "Cart Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }], // Fixed reference type
              validation: (Rule) => Rule.required(),
            },
            { name: "size", title: "Size", type: "string" },
            { name: "color", title: "Color", type: "string" },
            { name: "quantity", title: "Quantity", type: "number", validation: (Rule) => Rule.min(1).required() },
            {
              name: "image",
              title: "Product Image",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    },

    { name: "totalPrice", title: "Total Amount", type: "number", validation: (Rule) => Rule.min(0).required() },
    { name: "discountPercent", title: "Discount Percent", type: "number", validation: (Rule) => Rule.min(0).max(100) },

    {
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    },

    {
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Credit Card", value: "creditCard" },
          { title: "PayPal", value: "paypal" },
          { title: "Bitcoin", value: "bitcoin" },
        ],
        layout: "radio",
      },
      initialValue: "creditCard",
    },

    { name: "orderDate", title: "Order Date", type: "datetime", validation: (Rule) => Rule.required() },
  ],
});
