// components/EditModal.jsx
import React, { useState } from 'react';
import './AdminModal.css';

const EditModal = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    {Object.keys(item).map((key) => (
                        <div key={key}>
                            <label>{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                disabled={key === 'id'} // Disable id field
                            />
                        </div>
                    ))}
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
