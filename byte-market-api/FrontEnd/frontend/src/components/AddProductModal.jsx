import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider.jsx";
import "./AddProductModal.css";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const { userid } = useAuth(); // Fetch userid from context
  const [product, setProduct] = useState({
    productname: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    seller: { userid: userid }, // Automatically set the seller as the logged-in user
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8080/api/product/addProduct", product);
    console.log("Product added successfully:", response.data);
    onProductAdded();
    onClose();
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
      alert(`Error: ${error.response.data.message || "An error occurred"}`);
    } else if (error.request) {
      console.error("Error request:", error.request);
      alert("No response from server. Please try again later.");
    } else {
      console.error("Error:", error.message);
      alert("An error occurred. Please try again.");
    }
  }
};


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Product Name:
            <input
              type="text"
              name="productname"
              value={product.productname}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Add Product</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
