import React from "react";
import "./DeleteInventoryItemModal.css";

const DeleteInventoryItemModal = ({ showModal, onClose, onConfirm }) => {
    if (!showModal) return null;

    return (
        <div className="delete-inventory-modal-overlay" onClick={onClose}>
            <div
                className="delete-inventory-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h4>Confirm Deletion</h4>
                <p>Are you sure you want to delete this inventory item?</p>
                <div className="delete-inventory-modal-actions">
                    <button
                        onClick={onConfirm}
                        className="delete-inventory-modal-confirm-button"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="delete-inventory-modal-close-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteInventoryItemModal;
