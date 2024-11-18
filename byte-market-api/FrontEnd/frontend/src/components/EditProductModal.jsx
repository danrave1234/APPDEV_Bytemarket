import React, { useState, useEffect } from "react";
import "./EditProductModal.css";

const EditProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [productData, setProductData] = useState({
    productname: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (product) {
      setProductData({
        productname: product.productname || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category || '',
        description: product.description || '',
        image: product.image || '',
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
      console.log("Saving product data:", productData); // Log data before saving
      onSave(productData);
      onClose();
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file for upload:", file); // Log the selected file details
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image data after reading file:", reader.result); // Log the base64 data of the image
        let image = reader.result;
        let cleanedImage = image.replace(/^data:image\/[a-z]+;base64,/, "");
        console.log("Image data after cleaning:", cleanedImage); // Log the cleaned image data
        setProductData({
          ...productData,
          image: cleanedImage,
        });
      };
      reader.readAsDataURL(file); // Reads the image as a base64 URL
    }
  };

  return (
    <div className="editProduct-modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Editing Product Details</h3>
        <form onSubmit={handleSave} className="form-container">
          <div className="image-section">
            <div className="image-preview">
              {productData.image && (
                <img
                  src={`data:image/jpeg;base64,${productData.image}`}
                  alt="Product"
                  className="preview-img"
                />
              )}
            </div>
            <div className="image-upload-container">
              <label>Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="form-fields">
            <label>
              Product Name:
              <input
                type="text"
                name="productname"
                value={productData.productname}
                onChange={handleChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                min="0"
                onChange={handleChange}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={productData.category}
                onChange={handleChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
              />
            </label>
            <div>
              <button className="save-button" type="submit">Save</button>
              <button className="cancel-button" type="button" onClick={onClose}>Close</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;