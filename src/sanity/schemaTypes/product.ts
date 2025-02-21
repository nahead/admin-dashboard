import { defineType } from "sanity";

export default defineType({
  name: "products",
  title: "Products",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.min(1).required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true }, // Allows better cropping in Sanity CMS
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.min(0).required(),
      initialValue: 1,
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "T-Shirt", value: "tshirt" },
          { title: "Short", value: "short" },
          { title: "Jeans", value: "jeans" },
          { title: "Hoodie", value: "hoodie" },
          { title: "Shirt", value: "shirt" },
        ],
        layout: "dropdown",
      },
    },
    {
      name: "discountPercent",
      title: "Discount Percent",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    },
    {
      name: "new",
      title: "New Arrival",
      type: "boolean",
    },
    {
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
});
