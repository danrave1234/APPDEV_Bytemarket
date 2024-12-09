import React from "react";
import "./ClaimConfirmInventoryModal.css";

const ClaimConfirmInventoryModal = ({ showModal, onClose, onConfirm }) => {
    if (!showModal) return null;

    return (
        <div className="claim-confirm-modal-overlay" onClick={onClose}>
            <div
                className="claim-confirm-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h4>Confirm Claim</h4>
                <p>Are you sure you want to claim this inventory item?</p>
                <div className="claim-confirm-modal-actions">
                    <button
                        onClick={onConfirm}
                        className="claim-confirm-modal-confirm-button"
                    >
                        Yes, Claim
                    </button>
                    <button
                        onClick={onClose}
                        className="claim-confirm-modal-close-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClaimConfirmInventoryModal;
