import React, { useState, useEffect } from "react";
import './EditProductModal.css';

const EditProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [productData, setProductData] = useState({
    productname: '',
    price: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (product) {
      setProductData({
        productname: product.productname || '',
        price: product.price || '',
        category: product.category || '',
        description: product.description || '',
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (productData.productname && productData.price) {
      onSave(productData);
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Edit Product</h3>
        <form onSubmit={handleSave}>
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              name="productname"
              value={productData.productname}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
