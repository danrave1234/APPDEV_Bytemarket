import React from "react";
import './DeleteProductModal.css';

const DeleteProductModal = ({ isOpen, onClose, onDelete, productname }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="delete-product-modal-overlay">
      <div className="delete-product-modal-content">
        <button className="delete-close-btn" onClick={onClose}>X</button>
        <h3>Delete Product</h3>
        <p>Are you sure you want to delete the product <strong>{productname}</strong>?</p>
        <div className="delete-modal-buttons">
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
