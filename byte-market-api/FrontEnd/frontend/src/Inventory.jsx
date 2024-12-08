import React, { useState, useEffect } from "react";
import axios from "axios";
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import './styles/Inventory.css';

function Inventory() {
    const { userid } = useAuth();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/inventory/getCustomerInventory/${userid}`
                );
                const formattedInventory = response.data.flatMap((item) => {
                    if (!item.product) return []; // Skip items without product data
                    const items = Array.from({ length: item.quantity }, (_, i) => ({
                        ...item,
                        uniqueReference: `${item.transactionReferenceNumber}-${i + 1}`
                    }));
                    return items;
                });
                setInventory(formattedInventory);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [userid]);

    const claimItem = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/inventory/claimInventoryItem/${id}`);
            setInventory(inventory.map(item =>
                item.inventoryid === id ? { ...item, isClaimed: true } : item
            ));
        } catch (error) {
            console.error("Error claiming inventory item:", error);
        }
    };

    if (loading) return <p>Loading inventory...</p>;

    return (
        <PageLayout>
            <div className="inventory-component">
                <div className="inventory-container">
                    <h1>My Inventory</h1>
                    {inventory.length === 0 ? (
                        <p>No items in inventory.</p>
                    ) : (
                        <div className="inventory-grid">
                            {inventory.map((item, idx) => (
                                <div key={`${item.inventoryid}-${idx}`} className="inventory-card">
                                    <div className="product-image">
                                        {item.product?.image ? (
                                            <img
                                                src={`data:image/jpeg;base64,${item.product.image}`}
                                                alt={item.product.productname || "Product Image"}
                                            />
                                        ) : (
                                            <div className="image-placeholder">No Image Available</div>
                                        )}
                                    </div>
                                    <div className="product-details">
                                        <h2 className="product-name">{item.product?.productname || "Unknown Product"}</h2>
                                        <p className="product-category">{item.product?.category || "No Category"}</p>
                                        <p className="product-description">
                                            {item.product?.description?.length > 100
                                                ? `${item.product.description.slice(0, 100)}...`
                                                : item.product?.description || "No Description"}
                                        </p>
                                        <p>Date Added: {new Date(item.dateadded).toLocaleDateString()}</p>
                                        <p>Transaction Reference: {item.uniqueReference}</p>
                                        {!item.isClaimed ? (
                                            <button
                                                className="claim-button"
                                                onClick={() => claimItem(item.inventoryid)}
                                            >
                                                Claim
                                            </button>
                                        ) : (
                                            <p className="claimed-text">Claimed</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}

export default Inventory;
