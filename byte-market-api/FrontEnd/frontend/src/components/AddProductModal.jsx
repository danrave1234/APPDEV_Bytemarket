import React, {useEffect, useState} from "react";
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
    image: "",
  });
  useEffect(() => {
    if (!isOpen) {
      setProduct({
        productname: "",
        price: "",
        quantity: "",
        category: "",
        description: "",
        seller: { userid: userid },
        image: "",
      });
    }
  }, [isOpen]);
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file for upload:", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        let image = reader.result;
        let cleanedImage = image.replace(/^data:image\/[a-z]+;base64,/, "");
        setProduct({
          ...product,
          image: cleanedImage,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="addProduct-modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Add a New Product</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="image-section">
            <div className="image-preview">
              {product.image && (
                  <img src={`data:image/jpeg;base64,${product.image}`} alt="Product" className="preview-img"/>
              )}
            </div>
            <div className="image-upload-container">
              <label>Image:</label>
              <input type="file" name="image" onChange={handleImageUpload}/>
            </div>
          </div>
          <div className="form-fields">
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
            <div>
              <button type="submit">Add Product</button>
              <button type="button" onClick={onClose}>Close</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
